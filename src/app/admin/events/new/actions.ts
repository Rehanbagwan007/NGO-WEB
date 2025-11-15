'use server';

import type { ShareEventInput } from '@/ai/flows/share-event-flow';
import { shareEventOnSocialMedia } from '@/ai/flows/share-event-flow';
import type { Event } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';


type CreateEventArgs = Omit<Event, 'id' | 'createdAt' | 'date'> & {
    date: string;
    socialPlatforms: string[];
}

export async function createEventAction(args: CreateEventArgs) {
    const supabase = createClient();
    console.log("createEventAction received args:", JSON.stringify(args, null, 2));

  try {
    const { title, description, bannerimage, socialPlatforms, location, date, status, imagehint } = args;

    const eventData = {
        title,
        description,
        bannerimage,
        location,
        date,
        status,
        imagehint,
    };

    const { data: newEvent, error } = await supabase.from('events').insert(eventData).select().single();
    
    if (error) {
        throw new Error(error.message);
    }

    if (socialPlatforms && socialPlatforms.length > 0) {
        const shareInput: ShareEventInput = {
            title,
            description,
            imageUrl: newEvent.bannerimage,
            eventUrl: `https://your-website.com/events/${newEvent.id}`
        }
        shareEventOnSocialMedia(shareInput);
    }
    
    // Revalidate the paths to show the new event immediately
    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');

    return { success: true, title };

  } catch (error) {
    console.error("Error creating event: ", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
