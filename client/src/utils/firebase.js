import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../configs/firebase';

export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

export const uploadMultipleFiles = async (files, path) => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, path));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple files: ", error);
    throw error;
  }
};