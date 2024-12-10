import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '', 
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '', 
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

export async function POST(req: Request) {
  const data = await req.json();
  const { paramsToSign } = data;
  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET || ''
    );
    return NextResponse.json({
      signature,
    });
  } catch (error: any) {
    return NextResponse.json({
      error,
    });
  }
}
