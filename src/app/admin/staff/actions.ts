
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

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

export async function updateStaffMemberAction(id: string, formData: FormData) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const avatarFile = formData.get('avatar') as File | null;
    
    if (!name || !role) {
        return { success: false, error: 'Name and role are required.' };
    }

    try {
        const user = await getSupabaseUser();
        let avatarUrl: string | undefined = undefined;

        if (avatarFile && avatarFile.size > 0) {
            avatarUrl = await uploadFile(avatarFile, user, 'avatars');
        }

        const updateData: { name: string; role: string; avatar_url?: string } = { name, role };
        if (avatarUrl) {
            updateData.avatar_url = avatarUrl;
        }

        const { error } = await supabase
            .from('team_members')
            .update(updateData)
            .eq('id', id);

        if (error) {
            throw error;
        }

        revalidatePath('/admin/staff');
        revalidatePath('/about');

        return { success: true };
    } catch (error) {
        console.error('Error updating staff member:', error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error has occurred.' };
    }
}
