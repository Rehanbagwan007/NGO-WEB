
'use server';

import type { ShareEventInput } from '@/ai/flows/share-event-flow';
import { shareEventOnSocialMedia } from '@/ai/flows/share-event-flow';
import type { Event } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

async function getSupabaseUser(): Promise<User> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        throw new Error('User not found. Please log in again.');
    }
    return data.user;
}

export async function uploadFile(file: File, user: User): Promise<string> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const filePath = `${user.id}/events/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('images').upload(filePath, file);

    if (error) {
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
}

const revalidatePaths = () => {
    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');
    revalidatePath('/events/[id]', 'page');
}

type EventActionArgs = Omit<Event, 'id' | 'createdAt' | 'date'> & {
    date: string;
    socialPlatforms?: string[];
    galleryMedia?: FileList;
}

export async function createEventAction(args: EventActionArgs) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
        const { socialPlatforms, galleryMedia, ...eventData } = args;

        const { data: newEvent, error } = await supabase.from('events').insert(eventData).select().single();
        
        if (error) throw new Error(error.message);

        if (socialPlatforms && socialPlatforms.length > 0) {
            const shareInput: ShareEventInput = {
                title: newEvent.title,
                description: newEvent.description,
                imageUrl: newEvent.bannerimage,
                eventUrl: `https://your-website.com/events/${newEvent.id}` // Replace with actual URL
            }
            shareEventOnSocialMedia(shareInput);
        }
        
        revalidatePaths();
        return { success: true, event: newEvent };

    } catch (error) {
        console.error("Error creating event: ", error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function updateEventAction(id: string, args: EventActionArgs) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    try {
        const { socialPlatforms, galleryMedia, ...eventData } = args;

        const { data: updatedEvent, error } = await supabase.from('events').update(eventData).eq('id', id).select().single();
        
        if (error) throw new Error(error.message);

        revalidatePaths();
        return { success: true, event: updatedEvent };
    } catch (error) {
        console.error(`Error updating event ${id}: `, error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}


export async function deleteEventAction(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Optional: Delete associated images from storage first
    const { data: event, error: fetchError } = await supabase.from('events').select('bannerimage, gallery').eq('id', id).single();
    if (fetchError) {
        console.error(`Could not fetch event ${id} for image deletion. Continuing with row deletion.`);
    } else if (event) {
        const filesToDelete: string[] = [];
        if (event.bannerimage) {
            const bannerPath = event.bannerimage.substring(event.bannerimage.lastIndexOf('/images/') + 8);
            filesToDelete.push(bannerPath);
        }
        if (event.gallery) {
            event.gallery.forEach(item => {
                if (item.url) {
                    const galleryPath = item.url.substring(item.url.lastIndexOf('/images/') + 8);
                    filesToDelete.push(galleryPath);
                }
            });
        }

        if (filesToDelete.length > 0) {
            const { error: storageError } = await supabase.storage.from('images').remove(filesToDelete);
            if (storageError) {
                console.error(`Error deleting storage files for event ${id}:`, storageError.message);
                // Decide if you want to proceed even if file deletion fails
            }
        }
    }


    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePaths();
    return { success: true };
  } catch (error) {
    console.error(`Error deleting event ${id}: `, error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}
