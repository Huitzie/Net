
'use client';

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { FirebaseApp } from 'firebase/app';
import { initializeFirebase } from './'; // Use the central initializer

let storageInstance: ReturnType<typeof getStorage> | null = null;

function getStorageInstance() {
  if (!storageInstance) {
    const { firebaseApp } = initializeFirebase();
    storageInstance = getStorage(firebaseApp);
  }
  return storageInstance;
}

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in Firebase Storage where the file should be stored (e.g., 'vendors/userId/profile.jpg').
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}

/**
 * Deletes a file from Firebase Storage using its full URL.
 * @param fileUrl The public download URL of the file to delete.
 * @returns A promise that resolves when the file is deleted.
 */
export async function deleteFileFromUrl(fileUrl: string): Promise<void> {
  if (!fileUrl.startsWith('https://firebasestorage.googleapis.com')) {
    console.warn('Cannot delete file: URL is not a Firebase Storage URL.', fileUrl);
    return;
  }
  const storage = getStorageInstance();
  const fileRef = ref(storage, fileUrl);

  try {
    await deleteObject(fileRef);
  } catch (error: any) {
    // It's common to try deleting a file that doesn't exist, so we can often ignore that error.
    if (error.code === 'storage/object-not-found') {
      console.log('File to delete not found, skipping.');
    } else {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
