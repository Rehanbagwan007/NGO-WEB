
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { WebsiteContent } from '@/lib/types';

async function getSupabaseUser(): Promise<User> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        throw new Error('User not found. Please log in again.');
    }
    return data.user;
}

async function uploadFile(file: File, user: User): Promise<string> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const filePath = `${user.id}/hero-banners/${Date.now()}-${file.name}`;
    // Note: The client-side uploadFile in NewEvent page uses a different client.
    // This is a server-side action.
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

    if (uploadError) {
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
}

export async function addHeroBannerAction(formData: FormData) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const imageFile = formData.get('image') as File;
    const altText = formData.get('altText') as string;

    if (!imageFile) {
        return { success: false, error: 'Image file is required.' };
    }

    try {
        const user = await getSupabaseUser();
        const imageUrl = await uploadFile(imageFile, user);

        const { error } = await supabase.from('hero_banners').insert({
            image_url: imageUrl,
            alt_text: altText,
        });

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath('/');
        revalidatePath('/admin/website-settings');

        return { success: true };
    } catch (error) {
        console.error("Error adding hero banner:", error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function deleteHeroBannerAction(id: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
        const { error } = await supabase.from('hero_banners').delete().eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath('/');
        revalidatePath('/admin/website-settings');

        return { success: true };

    } catch (error) {
        console.error("Error deleting hero banner:", error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function updateWebsiteContentAction(data: Partial<WebsiteContent>) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const updates = Object.entries(data).map(([id, content]) => ({
        id,
        content: content || '',
    }));

    try {
        const { error } = await supabase.from('website_content').upsert(updates);
        if (error) throw error;
        
        // Revalidate all paths that might use this content
        revalidatePath('/');
        revalidatePath('/admin/website-settings');

        return { success: true };
    } catch(error) {
        console.error('Error updating website content:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error has occurred.'};
    }
}
