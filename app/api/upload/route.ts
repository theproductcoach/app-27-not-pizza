import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests
// This route requires BLOB_READ_WRITE_TOKEN in your environment variables
export async function POST(request: NextRequest) {
  try {
    // Check for multipart/form-data content type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Use Next.js built-in formData() method
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file found in the request' },
        { status: 400 }
      );
    }

    // Get file data
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const mimeType = file.type;

    // Check if it's an image
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'The uploaded file must be an image' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${fileName}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, buffer, {
      contentType: mimeType,
      access: 'public',
    });

    // Return the URL
    return NextResponse.json({ 
      success: true, 
      url: blob.url 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Reject non-POST requests
export async function GET() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}

function methodNotAllowed() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 