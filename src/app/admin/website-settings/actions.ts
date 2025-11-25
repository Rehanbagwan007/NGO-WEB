
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

async function uploadFile(file: File, user: User, folder: string): Promise<string> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const filePath = `${user.id}/${folder}/${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

    if (uploadError) {
        throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
}

export async function uploadMissionImageAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string; }> {
    const imageFile = formData.get('image') as File;
    if (!imageFile) {
        return { success: false, error: 'Image file is required.' };
    }

    try {
        const user = await getSupabaseUser();
        const imageUrl = await uploadFile(imageFile, user, 'content-images');
        return { success: true, url: imageUrl };
    } catch(error) {
        console.error('Error uploading mission image:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error has occurred.'};
    }
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
        const imageUrl = await uploadFile(imageFile, user, 'hero-banners');

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
        // TODO: Also delete image from storage
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
        
        revalidatePath('/');
        revalidatePath('/admin/website-settings');
        revalidatePath('/about');

        return { success: true };
    } catch(error) {
        console.error('Error updating website content:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error has occurred.'};
    }
}
