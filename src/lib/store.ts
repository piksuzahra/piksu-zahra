import { useState, useEffect } from 'react';
import { db, storage, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  try {
    const docRef = doc(db, 'config', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.value) {
        return JSON.parse(data.value) as T;
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
  return null;
}

async function setConfigOnServer(key: string, value: any) {
  const path = `config/${key}`;
  try {
    const docRef = doc(db, 'config', key);
    await setDoc(docRef, { value: JSON.stringify(value) });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const fileRef = ref(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
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
    await setConfigOnServer(key, data || '');
    setImage(data || defaultImage || null);
    window.dispatchEvent(new CustomEvent('appImageUpdated', { detail: { key, data: data || defaultImage } }));
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
    await setConfigOnServer(key, data || '');
    setAudio(data || defaultAudio || null);
    window.dispatchEvent(new CustomEvent('appAudioUpdated', { detail: { key, data: data || defaultAudio } }));
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
    await setConfigOnServer(key, data || '');
    setText(data || defaultText || null);
    window.dispatchEvent(new CustomEvent('appTextUpdated', { detail: { key, data: data || defaultText } }));
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
    await setConfigOnServer(key, newImages);
    setImages(newImages);
    window.dispatchEvent(new CustomEvent('appImageUpdated', { detail: { key, data: newImages } }));
  };

  return [images, updateImages] as const;
}

// Keep export for backward compatibility during transitions
export const imageStore = {
  setItem: async (key: string, value: any) => await setConfigOnServer(key, value)
};
