import { Button, Heading } from "@medusajs/ui"
import Link from "next/link"

const Hero = ({ countryCode }: { countryCode: string }) => {
  return (
    <div
      className="h-screen w-full relative bg-cover bg-center"
      style={{
        backgroundImage: "url('https://picsum.photos/1920/1080')",
      }}
    >
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6 bg-black bg-opacity-50">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-white font-normal"
          >
            Explore Our New Collection
          </Heading>
          <Heading
            level="h2"
            className="text-xl leading-8 text-gray-200 font-normal mt-2"
          >
            Discover the latest trends and styles.
          </Heading>
        </span>
        <Link href={`/${countryCode}/store`}>
          <Button
            variant="transparent"
            className="text-xl border-2 border-white px-8 py-4 text-white"
          >
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Hero
