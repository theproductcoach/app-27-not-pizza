# Is It Pizza?

A fun Next.js app that uses your camera to take a picture, uploads it to Vercel Blob Storage, and uses OpenAI GPT-4 Vision to tell you if the image contains pizza or not!

## Features

- Take a picture using your device camera or upload an image
- Uploads the image to Vercel Blob Storage
- Sends the image to OpenAI GPT-4 Vision for analysis
- Tells you if the image is pizza or not, with a playful UI
- Confetti celebration for pizza results
- Mobile-friendly and works in modern browsers

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root of your project with the following:

```env
OPENAI_API_KEY=your_openai_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

- Get your OpenAI API key from <https://platform.openai.com/api-keys>
- Get your Vercel Blob token from <https://vercel.com/docs/storage/vercel-blob>

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

To build and start in production mode:

```bash
npm run build
npm start
```

## Image Domains

This app is configured to allow images from Vercel Blob Storage. If you use a different storage provider, update `next.config.ts` accordingly.

## Project Structure

- `app/page.tsx` — Main UI and logic
- `app/api/upload/route.ts` — Handles image uploads to Vercel Blob
- `app/api/analyze/route.ts` — Handles image analysis with OpenAI Vision
- `components/CameraCapture.tsx` — Camera and file upload component

## Customization

- Update the background or pizza images in the `public/` folder
- Tweak the UI in `app/page.tsx` for your own style

## Credits

- Built with [Next.js](https://nextjs.org/)
- Uses [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for storage
- Uses [OpenAI GPT-4 Vision](https://platform.openai.com/docs/guides/vision) for image analysis
- Confetti by [react-confetti](https://github.com/alampros/react-confetti)

---

Enjoy finding out if your food is pizza! 🍕
