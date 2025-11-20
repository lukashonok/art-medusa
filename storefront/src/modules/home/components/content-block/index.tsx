import { Button, Heading } from "@medusajs/ui"
import Link from "next/link"
import Image from "next/image"

type ContentBlockProps = {
  image: string
  title: string
  text: string
  buttonLabel?: string
  buttonLink?: string
  reverse?: boolean
}

const ContentBlock = ({
  image,
  title,
  text,
  buttonLabel,
  buttonLink,
  reverse = false,
}: ContentBlockProps) => {
  return (
    <div className="py-12">
      <div className="content-container">
        <div
          className={`flex flex-col md:flex-row items-center gap-12 ${
            reverse ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="w-full md:w-1/2">
            <Image
              src={image}
              alt={title}
              width={500}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <Heading level="h2" className="text-3xl">
              {title}
            </Heading>
            <p className="mt-4 text-lg">{text}</p>
            {buttonLabel && buttonLink && (
              <Link href={buttonLink} className="mt-6 inline-block">
                <Button variant="secondary">{buttonLabel}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentBlock
