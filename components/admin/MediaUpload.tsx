import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function MediaUpload() {
	const [file, setFile] = useState<File | null>(null);
	const [name, setName] = useState('');
	const [type, setType] = useState<'image' | 'video'>('image');

	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		try {
			const storageRef = ref(storage, `media/${file.name}`);
			await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);

			await addDoc(collection(db, 'media'), {
				name,
				type,
				url,
			});

			toast.success('Media uploaded and assigned successfully!');
			setFile(null);
			setName('');
		} catch (error) {
			console.log("🚀 ~ handleUpload ~ error:", error)
			toast.error('Failed to upload media');
		}
	};

	return (
		<form onSubmit={handleUpload} className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700'>Name</label>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
					required
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-gray-700'>Type</label>
				<select
					value={type}
					onChange={(e) => setType(e.target.value as 'image' | 'video')}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
				>
					<option value='image'>Image</option>
					<option value='video'>Video</option>
				</select>
			</div>
			<div>
				<label className='block text-sm font-medium text-gray-700'>File</label>
				<input
					type='file'
					onChange={(e) => setFile(e.target.files?.[0] || null)}
					className='mt-1 block w-full'
					accept={type === 'image' ? 'image/*' : 'video/*'}
					required
				/>
			</div>
			<button
				type='submit'
				className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'
			>
				Upload Media
			</button>
		</form>
	);
}
