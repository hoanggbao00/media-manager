import { Button } from './button';
import {
	CldUploadWidget,
	CloudinaryUploadWidgetOptions,
	CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import React from 'react';

interface Props {
	onUpload: (result: CloudinaryUploadWidgetResults, wget: any) => Promise<void> | undefined;
	options?: CloudinaryUploadWidgetOptions;
}

// Docs: https://cloudinary.com/blog/cloudinary-image-uploads-using-nextjs-app-router

export const Uploader = ({ onUpload, options }: Props) => {
	const uploadPreset = process.env
		.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

	const defaultOptions: CloudinaryUploadWidgetOptions = {
		sources: ['local'],
		maxFiles: 1,
		multiple: false,
		singleUploadAutoClose: true,
		showPoweredBy: false,
		styles: {
			zIndex: 9999,
		},
		...options,
	};

	return (
		<>
			<CldUploadWidget
				uploadPreset={uploadPreset}
				signatureEndpoint='/api/sign'
				onSuccess={(result, wget) => {
					if (typeof result.info === 'object' && 'secure_url' in result.info) {
						onUpload(result, wget);
						wget.close();
					}
				}}
				options={defaultOptions}
			>
				{({ open }) => {
					function handleOnClick(e: any) {
						e.preventDefault();
						// if (setState) setState(false);
						open();
					}
					return (
						<Button variant='outline' onClick={handleOnClick} type='button'>
							Upload Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</>
	);
};


export interface UploadResult {
  asset_id: string
  public_id: string
  format: string
  version: number
  resource_type: string
  type: string
  created_at: string
  bytes: number
  width: number
  height: number
  backup: boolean
  asset_folder: string
  display_name: string
  url: string
  secure_url: string
  next_cursor: string
  derived: Derived[]
}

export interface Derived {
  transformation: string
  format: string
  bytes: number
  id: string
  url: string
  secure_url: string
}
