import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export const UploadImage = async (file: File) => {
	const formData = new FormData();
	formData.append('file', file);

	const storageRef = ref(storage, `media/${file.name}`);
	await uploadBytes(storageRef, file);
	const url = await getDownloadURL(storageRef);

	return url;
};
