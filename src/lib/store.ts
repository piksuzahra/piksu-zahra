import { useState, useEffect } from 'react';
import { db, storage, handleFirestoreError, OperationType, authReady } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import firebaseConfig from '../../firebase-applet-config.json';

const defaultGallery = [
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543881477-84bc343e031a?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1623547668612-9c3f3f87053e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549416878-b9247eb95123?q=80&w=600&auto=format&fit=crop"
];

async function getConfigFromServer<T>(key: string): Promise<T | null> {
  const path = `config/${key}`;
  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout fetching ${key}`)), 10000)
  );

  try {
    const docRef = doc(db, 'config', key);
    const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]) as any;
    
    if (docSnap && docSnap.exists()) {
      const data = docSnap.data();
      if (data.value) {
        try {
          return JSON.parse(data.value) as T;
        } catch (e) {
          console.warn(`Failed to parse config for ${key}, returning raw value:`, data.value);
          return data.value as unknown as T;
        }
      }
    }
  } catch (err) {
    console.error(`Error loading config for ${key}:`, err);
    // don't throw, just return null so default can be used
  }
  return null;
}

async function setConfigOnServer(key: string, value: any) {
  const path = `config/${key}`;
  const timeoutPromise = new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout saving ${key}`)), 10000)
  );

  try {
    const docRef = doc(db, 'config', key);
    const savePromise = setDoc(docRef, { value: JSON.stringify(value) });
    await Promise.race([savePromise, timeoutPromise]);
    console.log(`Config ${key} saved successfully`);
  } catch (err) {
    console.error(`Error saving config for ${key}:`, err);
    throw err;
  }
}

export async function uploadFile(file: File, path: string): Promise<string> {
  console.log(`Starting local conversion for: ${path}, original size: ${file.size} bytes`);
  
  let fileToUpload: File | Blob = file;

  // dispatch progress
  window.dispatchEvent(new CustomEvent('uploadProgress', { 
    detail: { path, progress: 10, stage: 'Compressing' } 
  }));

  // Aggressive compression for size limits (Firestore 1MB limit for config documents)
  if (file.type.startsWith('image/')) {
    try {
      const options = {
        maxSizeMB: 0.05, // Strict 50KB limit to fit inside Firestore config arrays
        maxWidthOrHeight: 800,
        useWebWorker: true,
        initialQuality: 0.6,
        onProgress: (progress: number) => {
           console.log(`Compression: ${Math.round(progress)}%`);
           window.dispatchEvent(new CustomEvent('uploadProgress', { 
             detail: { path, progress: Math.round(10 + progress * 0.4), stage: 'Compressing' } 
           }));
        }
      };
      fileToUpload = await imageCompression(file, options);
      console.log(`Compressed: ${file.size} -> ${(fileToUpload as Blob).size} bytes`);
    } catch (err) {
      console.warn('Compression skipped:', err);
    }
  }
  
  window.dispatchEvent(new CustomEvent('uploadProgress', { 
    detail: { path, progress: 70, stage: 'Encoding' } 
  }));
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      window.dispatchEvent(new CustomEvent('uploadProgress', { 
        detail: { path, progress: 100, stage: 'Done' } 
      }));
      resolve(result); // Return the base64 string
    };
    reader.onerror = (e) => {
      window.dispatchEvent(new CustomEvent('uploadProgress', { 
        detail: { path, progress: 0, stage: 'Error', error: 'Gagal mengkonversi file' } 
      }));
      reject(new Error("Gagal membaca file"));
    };
    reader.readAsDataURL(fileToUpload);
  });
}

export function useAppImage(key: string, defaultImage?: string) {
  const [image, setImage] = useState<string | null>(defaultImage || null);

  useEffect(() => {
    const loadImage = async () => {
      const storedImage = await getConfigFromServer<string>(key);
      if (storedImage) setImage(storedImage);
    };
    
    loadImage();

    const handleImageUpdate = (e: CustomEvent) => {
      if (e.detail.key === key) setImage(e.detail.data);
    };

    window.addEventListener('appImageUpdated', handleImageUpdate as EventListener);
    return () => window.removeEventListener('appImageUpdated', handleImageUpdate as EventListener);
  }, [key]);

  const updateImage = async (data: string | null) => {
    setImage(data || defaultImage || null);
    window.dispatchEvent(new CustomEvent('appImageUpdated', { detail: { key, data: data || defaultImage } }));
    try {
      await setConfigOnServer(key, data || '');
    } catch (err) {
      console.error(`Background save failed for image ${key}:`, err);
    }
  };

  return [image, updateImage] as const;
}

export function useAppAudio(key: string, defaultAudio?: string) {
  const [audio, setAudio] = useState<string | null>(defaultAudio || null);

  useEffect(() => {
    const loadAudio = async () => {
      const storedAudio = await getConfigFromServer<string>(key);
      if (storedAudio) setAudio(storedAudio);
    };
    
    loadAudio();

    const handleAudioUpdate = (e: CustomEvent) => {
      if (e.detail.key === key) setAudio(e.detail.data);
    };

    window.addEventListener('appAudioUpdated', handleAudioUpdate as EventListener);
    return () => window.removeEventListener('appAudioUpdated', handleAudioUpdate as EventListener);
  }, [key]);

  const updateAudio = async (data: string | null) => {
    setAudio(data || defaultAudio || null);
    window.dispatchEvent(new CustomEvent('appAudioUpdated', { detail: { key, data: data || defaultAudio } }));
    try {
      await setConfigOnServer(key, data || '');
    } catch (err) {
      console.error(`Background save failed for audio ${key}:`, err);
    }
  };

  return [audio, updateAudio] as const;
}

export function useAppText(key: string, defaultText?: string) {
  const [text, setText] = useState<string | null>(defaultText || null);

  useEffect(() => {
    const loadText = async () => {
      const storedText = await getConfigFromServer<string>(key);
      if (storedText !== null && storedText !== undefined) setText(storedText);
    };
    
    loadText();

    const handleTextUpdate = (e: CustomEvent) => {
      if (e.detail.key === key) setText(e.detail.data);
    };

    window.addEventListener('appTextUpdated', handleTextUpdate as EventListener);
    return () => window.removeEventListener('appTextUpdated', handleTextUpdate as EventListener);
  }, [key]);

  const updateText = async (data: string | null) => {
    setText(data || defaultText || null);
    window.dispatchEvent(new CustomEvent('appTextUpdated', { detail: { key, data: data || defaultText } }));
    try {
      await setConfigOnServer(key, data || '');
    } catch (err) {
      console.error(`Background save failed for text ${key}:`, err);
    }
  };

  return [text, updateText] as const;
}

export function useGalleryImages() {
  const key = 'galleryPhotos';
  const [images, setImages] = useState<string[]>(defaultGallery);

  useEffect(() => {
    const loadImages = async () => {
      const storedImages = await getConfigFromServer<string[]>(key);
      if (storedImages && storedImages.length > 0) {
        setImages(storedImages);
      } else {
        setImages(defaultGallery);
      }
    };
    
    loadImages();

    const handleUpdate = (e: CustomEvent) => {
      if (e.detail.key === key) setImages(e.detail.data);
    };

    window.addEventListener('appImageUpdated', handleUpdate as EventListener);
    return () => window.removeEventListener('appImageUpdated', handleUpdate as EventListener);
  }, []);

  const updateImages = async (newImages: string[]) => {
    setImages(newImages);
    window.dispatchEvent(new CustomEvent('appImageUpdated', { detail: { key, data: newImages } }));
    try {
      await setConfigOnServer(key, newImages);
    } catch (err) {
      console.error(`Background save failed for gallery:`, err);
    }
  };

  return [images, updateImages] as const;
}

// Keep export for backward compatibility during transitions
export const imageStore = {
  setItem: async (key: string, value: any) => await setConfigOnServer(key, value)
};
