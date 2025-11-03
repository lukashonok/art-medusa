"use client" // This component needs to be a client component

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(images[0])

  if (!images || images.length === 0) {
    // Handle case with no images, maybe show a placeholder
    return (
      <div className="flex items-start relative">
        <div className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle">
          {/* Placeholder image or text */}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Main Image */}
      <Container
        className="relative aspect-video w-full overflow-hidden bg-ui-bg-subtle"
        id={currentImage.id}
      >
        {!!currentImage.url && (
          <Image
            src={currentImage.url}
            priority={true}
            className="absolute inset-0 rounded-rounded"
            alt={`Product image`}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "contain", // Use 'contain' for horizontal images
            }}
          />
        )}
      </Container>

      {/* Thumbnails */}
      <div className="flex items-center justify-center gap-x-4 mt-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentImage(image)}
            className={`w-20 h-20 relative border-2 rounded-md overflow-hidden ${
              currentImage.id === image.id ? "border-blue-500" : "border-transparent"
            }`}
          >
            {!!image.url && (
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
