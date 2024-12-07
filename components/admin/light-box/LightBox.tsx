import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
	type: 'image' | 'video';
	url: string;
	onClose: () => void;
}

export default function LightBoxImage({ type, url, onClose }: Props) {
	return (
		<div className='fixed inset-0 z-[9999] flex items-center justify-center !mt-0'>
			<div className='bg-gray-400/50 absolute inset-0' onClick={onClose} />
			<Button
				variant='ghost'
				onClick={onClose}
				className='absolute z-10 top-4 right-4 text-white hover:text-gray-400'
			>
				<X size={48} />
			</Button>
			<div className='absolute z-10 w-full aspect-video md:w-2/3 bg-white rounded-md'>
				{type === 'image' ? (
					<img src={url} alt={url} className='size-full object-cover rounded-md' />
				) : (
					<video src={url} className='size-full object-cover rounded-md' controls />
				)}
			</div>
		</div>
	);
}
