'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { authenticateUser, updateUserStatus } from '@/services/auth';

export function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { setUser, setIsAdmin } = useAuthStore();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const result = await authenticateUser(username, password);

			if (result) {
				const { user, isAdmin } = result;

				if (isAdmin) {
					setUser(user);
					setIsAdmin(true);
					router.push('/admin');
				} else {
					await updateUserStatus(user.id!, 'playing');
					setUser(user);
					setIsAdmin(false);
					router.push('/play');
				}
			} else {
				toast.error('Invalid credentials');
			}
		} catch (error) {
			toast.error('Login failed');
			console.error('Login error:', error);
		}
	};

	return (
		<form onSubmit={handleLogin} className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Username
				</label>
				<input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
					required
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Password
				</label>
				<input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
					required
				/>
			</div>
			<button
				type='submit'
				className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
			>
				Login
			</button>
		</form>
	);
}
