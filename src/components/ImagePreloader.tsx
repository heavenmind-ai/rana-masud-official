import ReactDOM from "react-dom";

interface ImagePreloaderProps {
  images: string[];
}

/**
 * Server-Side/Hydration Image Preloader
 * Uses React 19 native ReactDOM.preload to inject <link rel="preload" as="image" href="..." />
 * into the document head, ensuring the browser fetches assets instantly on first render.
 */
export default function ImagePreloader({ images }: ImagePreloaderProps) {
  if (!images || images.length === 0) return null;

  images.forEach((img) => {
    if (img) {
      ReactDOM.preload(img, { as: "image" });
    }
  });

  return null;
}
