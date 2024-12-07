'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface Props {
	text: string;
}

export default function PasswordColumn({ text }: Props) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className='flex gap-2'>
			<p>{showPassword ? text : '•'.repeat(text.length)}</p>
			<button onClick={() => setShowPassword(!showPassword)}>
				{showPassword ? (
					<EyeOff className='size-4' />
				) : (
					<Eye className='size-4' />
				)}
			</button>
		</div>
	);
}
