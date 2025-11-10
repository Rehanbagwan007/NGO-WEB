
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path where the file should be stored in Firebase Storage.
 * @returns A promise that resolves with the download URL and the storage path of the uploaded file.
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<{ url: string; path: string }> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const storageRef = ref(storage, path);

  try {
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    });
    const url = await getDownloadURL(snapshot.ref);
    return { url, path: snapshot.ref.fullPath };
  } catch (error) {
    console.error('Error uploading file:', error);
    // You can add more specific error handling here if needed
    throw new Error(`Failed to upload file: ${(error as Error).message}`);
  }
}
