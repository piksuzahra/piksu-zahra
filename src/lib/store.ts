import { useState, useEffect } from 'react';
import { db, storage, handleFirestoreError, OperationType, authReady } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import firebaseConfig from '../../firebase-applet-config.json';

const defaultGallery = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549416878-b9247eb95123?q=60&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=60&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=60&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543881477-84bc343e031a?q=60&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1623547668612-9c3f3f87053e?q=60&w=800&auto=format&fit=crop"
];

async function getConfigFromServer<T>(key: string): Promise<T | null> {
  const path = `config/${key}`;

  try {
    const docRef = doc(db, 'config', key);
    const docSnap = await getDoc(docRef) as any;
    
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
    if ((err as Error)?.message?.includes('offline')) {
      console.warn(`Device offline, loading config for ${key} failed, using default`);
    } else {
      console.error(`Error loading config for ${key}:`, err);
    }
    // don't throw, just return null so default can be used
  }
  return null;
}

async function setConfigOnServer(key: string, value: any) {
  try {
    const stringified = JSON.stringify(value);
    
    // Firestore document limit is 1,048,576 bytes
    // We check the size of the string representation
    const sizeInBytes = new TextEncoder().encode(stringified).length;
    if (sizeInBytes > 1048000) { // Keep a small buffer
      console.error(`Document size for ${key} is too large: ${sizeInBytes} bytes`);
      throw new Error(`Ukuran data ${key} terlalu besar (${Math.round(sizeInBytes/1024)}KB). Firestore hanya mendukung maksimal 1MB. Silahkan gunakan file yang lebih kecil atau pastikan koneksi lancar agar file terupload ke Storage.`);
    }

    const docRef = doc(db, 'config', key);
    await setDoc(docRef, { value: stringified });
    console.log(`Config ${key} saved successfully (${sizeInBytes} bytes)`);
  } catch (err) {
    console.error(`Error saving config for ${key}:`, err);
    // Explicitly alert the user if a text/config save fails so they don't think it worked
    if (!(err as Error)?.message?.includes('offline')) {
      alert(`Gagal menyimpan data ${key}: ${err instanceof Error ? err.message : 'Coba lagi nanti'}`);
    }
    throw err;
  }
}

export async function uploadFile(file: File, path: string): Promise<string> {
  console.log(`Starting upload for: ${path}, original size: ${file.size} bytes`);
  
  // For very small files (< 100KB), just use base64 immediately to be fast and avoid storage issues
  if (file.size < 100 * 1024 && !path.startsWith('audio/')) {
    console.log("Small file detected, using direct encoding...");
    return await encodeAsBase64(file, path);
  }

  // Ensure Firebase is ready
  try {
    await authReady;
  } catch (e) {
    console.warn("Auth failed, continuing anyway...", e);
  }
  
  let fileToUpload: File | Blob = file;

  // Try Firebase Storage first
  try {
    const storageRef = ref(storage, path);
    const metadata = { contentType: file.type || 'application/octet-stream' };
    
    return await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.warn("Storage upload timed out, falling back...");
        uploadTask.cancel();
        reject(new Error("Upload timeout (60s)"));
      }, 60000);

      const uploadTask = uploadBytesResumable(storageRef, fileToUpload, metadata);
      let lastBytes = 0;
      let lastUpdate = Date.now();

      const stalledInterval = setInterval(() => {
        const currentBytes = uploadTask.snapshot.bytesTransferred;
        const totalBytes = uploadTask.snapshot.totalBytes || 1;
        const isAudio = path.startsWith('audio/');
        const stallThreshold = isAudio ? 30000 : 15000; // Give audio 30s stall window

        if (currentBytes > lastBytes) {
          lastBytes = currentBytes;
          lastUpdate = Date.now();
        } else if (Date.now() - lastUpdate > stallThreshold) { 
          console.warn(`Upload stalled for ${stallThreshold/1000}s, falling back...`);
          clearInterval(stalledInterval);
          (uploadTask as any)._stalled = true;
          uploadTask.cancel();
          reject(new Error("Stalled"));
        } else if (Date.now() - lastUpdate > 3000 && currentBytes === 0) {
          window.dispatchEvent(new CustomEvent('uploadProgress', { 
            detail: { path, progress: 1, stage: 'Menghubungkan ke Storage...' } 
          }));
        }
      }, 1000);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / (snapshot.totalBytes || 1)) * 100;
          // Only show 1% if we actually have some tiny progress or it's just started
          const displayProgress = Math.max(1, Math.round(progress));

          window.dispatchEvent(new CustomEvent('uploadProgress', { 
            detail: { path, progress: displayProgress, stage: 'Uploading' } 
          }));
        }, 
        (error) => {
          clearTimeout(timeout);
          clearInterval(stalledInterval);
          if (error.code === 'storage/canceled' || (uploadTask as any)._stalled) {
             console.warn("Upload canceled by monitor, triggering fallback...");
             const fallbackErr = new Error("Fallback Triggered");
             (fallbackErr as any).code = 'canceled';
             reject(fallbackErr);
          } else {
             console.error("Storage upload error:", error);
             reject(error);
          }
        }, 
        async () => {
          clearTimeout(timeout);
          clearInterval(stalledInterval);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            window.dispatchEvent(new CustomEvent('uploadProgress', { 
              detail: { path, progress: 100, stage: 'Done' } 
            }));
            resolve(downloadURL);
          } catch(e) {
            reject(e);
          }
        }
      );
    });
  } catch (error) {
    const isStalled = (error as any)?.code === 'stalled' || (error as any)?.code === 'canceled' || (error as any)?.code === 'storage/canceled';
    console.warn(`Firebase Storage upload failed (${(error as any)?.code || 'unknown'}), falling back to base64...`, error);
    
    window.dispatchEvent(new CustomEvent('uploadProgress', { 
      detail: { path, progress: 10, stage: isStalled ? 'Switching to Fallback Mode' : 'Compressing' } 
    }));

    if (file.type.startsWith('image/')) {
      try {
        const options = {
          maxSizeMB: 0.1, // Increased slightly to 100KB for better quality
          maxWidthOrHeight: 1200, // Better resolution
          useWebWorker: true,
          initialQuality: 0.7,
          onProgress: (progress: number) => {
             window.dispatchEvent(new CustomEvent('uploadProgress', { 
               detail: { path, progress: Math.round(10 + progress * 0.4), stage: 'Compressing' } 
             }));
          }
        };
        fileToUpload = await imageCompression(file, options);
      } catch (err) {
        console.warn('Compression skipped:', err);
      }
    } else if (file.type.startsWith('audio/')) {
      // Audio files are very hard to fallback because of the 1MB document limit
      // 700KB file -> ~933KB base64 -> close to 1MB Firestore limit
      if (file.size > 700 * 1024) {
         window.dispatchEvent(new CustomEvent('uploadProgress', { 
           detail: { path, progress: 0, stage: 'Error', error: 'Audio terlalu besar untuk mode cadangan (max 700KB)' } 
         }));
         throw new Error("File audio ini terlalu besar (>700KB) untuk disimpan secara cadangan di database. Silahkan cek koneksi internet Anda agar file dapat terunggah ke Cloud Storage, atau gunakan file yang lebih kecil.");
      }
    } else {
      if (file.size > 1024 * 1024) {
         throw new Error("File is too large for fallback storage (limit 1MB)");
      }
    }
    
    return await encodeAsBase64(fileToUpload, path);
  }
}

async function encodeAsBase64(file: File | Blob, path: string): Promise<string> {
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
      resolve(result);
    };
    reader.onerror = (e) => {
      window.dispatchEvent(new CustomEvent('uploadProgress', { 
        detail: { path, progress: 0, stage: 'Error', error: 'Gagal mengkonversi file' } 
      }));
      reject(new Error("Gagal membaca file"));
    };
    reader.readAsDataURL(file);
  });
}

export function useAppImage(key: string, defaultImage?: string) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImage = await getConfigFromServer<string>(key);
        if (storedImage) setImage(storedImage);
      } finally {
        setLoading(false);
      }
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

  return [image, updateImage, loading] as const;
}

export function useAppAudio(key: string, defaultAudio?: string) {
  const [audio, setAudio] = useState<string | null>(defaultAudio || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const storedAudio = await getConfigFromServer<string>(key);
        if (storedAudio) setAudio(storedAudio);
      } finally {
        setLoading(false);
      }
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

  return [audio, updateAudio, loading] as const;
}

export function useAppText(key: string, defaultText?: string) {
  const [text, setText] = useState<string | null>(defaultText || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadText = async () => {
      try {
        const storedText = await getConfigFromServer<string>(key);
        if (storedText !== null && storedText !== undefined) setText(storedText);
      } finally {
        setLoading(false);
      }
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

  return [text, updateText, loading] as const;
}

export function useGalleryImages() {
  const key = 'galleryPhotos';
  const [images, setImages] = useState<string[]>(defaultGallery);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await getConfigFromServer<string[]>(key);
        if (storedImages && storedImages.length > 0) {
          setImages(storedImages);
        } else {
          setImages(defaultGallery);
        }
      } finally {
        setLoading(false);
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

  return [images, updateImages, loading] as const;
}

// Keep export for backward compatibility during transitions
export const imageStore = {
  setItem: async (key: string, value: any) => await setConfigOnServer(key, value)
};
