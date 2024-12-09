'use client';
import { twMerge } from 'tailwind-merge';

interface Props {
	url: string;
	autoPlay?: boolean;
	className?: string;
	onClick?: () => void;
}

export default function YoutubeEmbed({
	url,
	autoPlay = false,
	className,
	onClick,
}: Props) {
	return (
		<div className={twMerge('w-full aspect-video relative', className)}>
			{onClick && (
				<div className='absolute z-10 inset-0 text-white hover:text-gray-400' onClick={onClick}/>
			)}
			<iframe
				id='ytPlayer'
				src={`https://www.youtube.com/embed/${url}?playlist=${url}&autoplay=${
					autoPlay ? 1 : 0
				}&loop=1`}
				className={twMerge('w-full aspect-video', className)}
				allow={autoPlay ? 'autoplay' : ''}
			></iframe>
		</div>
	);
}
