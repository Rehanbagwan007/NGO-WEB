
'use server';

import { db, storage } from '@/lib/firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { ShareEventInput } from '@/ai/flows/share-event-flow';
import { shareEventOnSocialMedia } from '@/ai/flows/share-event-flow';

async function uploadFile(file: File, path: string): Promise<{ url: string; path: string }> {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, fileBuffer, {
    contentType: file.type,
  });
  const url = await getDownloadURL(snapshot.ref);
  return { url, path: snapshot.ref.fullPath };
}

export async function createEventAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dateStr = formData.get('date') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zipCode = formData.get('zipCode') as string;
    const status = formData.get('status') as string;
    const imageHint = formData.get('imageHint') as string;
    const socialPlatforms = formData.getAll('socialPlatforms') as string[];

    const bannerFile = formData.get('bannerImage') as File;
    const galleryFiles = formData.getAll('galleryMedia') as File[];

    if (!bannerFile || bannerFile.size === 0) {
      throw new Error('Banner image is required.');
    }
    
    const eventId = `evt-${Date.now()}`;

    // 1. Upload Banner Image
    const bannerPath = `events/${eventId}/banner-${bannerFile.name}`;
    const { url: bannerImageUrl, path: bannerStoragePath } = await uploadFile(bannerFile, bannerPath);

    // 2. Upload Gallery Media
    const galleryUploadPromises = galleryFiles
        .filter(file => file.size > 0)
        .map((file: File) => {
            const galleryPath = `events/${eventId}/gallery-${file.name}`;
            return uploadFile(file, galleryPath);
        });
    const galleryItems = await Promise.all(galleryUploadPromises);


    // 3. Prepare data for Firestore
    const eventData = {
      title,
      description,
      date: new Date(dateStr),
      location: `${address}, ${city}, ${state} ${zipCode}`,
      address,
      city,
      state,
      zipCode,
      status,
      bannerImage: bannerImageUrl,
      storagePath: bannerStoragePath,
      imageHint: imageHint || '',
      gallery: galleryItems.map(item => ({ url: item.url, path: item.path })),
      createdAt: serverTimestamp(),
    };

    // 4. Save to Firestore
    const docRef = await addDoc(collection(db, "events"), eventData);

    // 5. Share on Social Media (if selected)
    if (socialPlatforms && socialPlatforms.length > 0) {
        const shareInput: ShareEventInput = {
            title,
            description,
            imageUrl: bannerImageUrl,
            eventUrl: `https://your-website.com/events/${docRef.id}`
        }
        await shareEventOnSocialMedia(shareInput);
    }
    
    return { success: true, title };

  } catch (error) {
    console.error("Error creating event: ", error);
    return { success: false, error: (error as Error).message };
  }
}
