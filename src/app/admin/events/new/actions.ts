
'use server';

import { db } from '@/lib/firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { ShareEventInput } from '@/ai/flows/share-event-flow';
import { shareEventOnSocialMedia } from '@/ai/flows/share-event-flow';
import type { Event } from '@/lib/types';


type CreateEventArgs = Omit<Event, 'id' | 'createdAt'> & {
    socialPlatforms: string[];
}

export async function createEventAction(args: CreateEventArgs) {
  try {
    const { title, description, date, location, address, city, state, zipCode, status, bannerImage, storagePath, imageHint, gallery, socialPlatforms } = args;

    // 1. Prepare data for Firestore
    // Note: The 'date' comes in as an ISO string, so we convert it back to a Date object for Firestore.
    const eventData: Omit<Event, 'id'> = {
      title,
      description,
      date: new Date(date),
      location,
      address,
      city,
      state,
      zipCode,
      status,
      bannerImage,
      storagePath,
      imageHint,
      gallery,
      createdAt: serverTimestamp() as Date, // Firestore will convert this
    };

    // 2. Save to Firestore
    const docRef = await addDoc(collection(db, "events"), eventData);

    // 3. Share on Social Media (if selected)
    if (socialPlatforms && socialPlatforms.length > 0) {
        const shareInput: ShareEventInput = {
            title,
            description,
            imageUrl: bannerImage,
            // Replace with your actual website URL
            eventUrl: `https://your-website.com/events/${docRef.id}`
        }
        // We don't await this as it can happen in the background
        shareEventOnSocialMedia(shareInput);
    }
    
    return { success: true, title };

  } catch (error) {
    console.error("Error creating event: ", error);
    return { success: false, error: (error as Error).message };
  }
}
