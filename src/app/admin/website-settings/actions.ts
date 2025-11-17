
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { User } from '@supabase/supabase-js';

async function getSupabaseUser(): Promise<User> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        throw new Error('User not found. Please log in again.');
    }
    return data.user;
}

async function uploadFile(file: File, user: User): Promise<string> {
    const supabase = createClient();
    const filePath = `${user.id}/hero-banners/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('images').upload(filePath, file);

    if (error) {
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
}

export async function addHeroBannerAction(formData: FormData) {
    const supabase = createClient();
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
    const supabase = createClient();

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
