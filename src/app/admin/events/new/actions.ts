
'use server';

import type { ShareEventInput } from '@/ai/flows/share-event-flow';
import { shareEventOnSocialMedia } from '@/ai/flows/share-event-flow';
import type { Event } from '@/lib/types';


type CreateEventArgs = Omit<Event, 'id' | 'createdAt' | 'date'> & {
    date: string;
    socialPlatforms: string[];
}

export async function createEventAction(args: CreateEventArgs) {
    console.log("createEventAction received args:", JSON.stringify(args, null, 2));

  try {
    const { title, description, bannerImage, socialPlatforms } = args;

    // Simulate saving the event
    console.log("Simulating event creation with title:", title);

    // 3. Share on Social Media (if selected)
    if (socialPlatforms && socialPlatforms.length > 0) {
        const shareInput: ShareEventInput = {
            title,
            description,
            imageUrl: bannerImage, // This will be a placeholder URL
            // In a real app, you'd generate a real URL
            eventUrl: `https://your-website.com/events/evt-simulated-${Date.now()}`
        }
        // We don't await this as it can happen in the background
        shareEventOnSocialMedia(shareInput);
    }
    
    return { success: true, title };

  } catch (error) {
    console.error("Error creating event: ", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
