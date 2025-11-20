import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import ContentBlock from "@modules/home/components/content-block"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero countryCode={countryCode} />
      <ContentBlock
        image="https://picsum.photos/800/600?random=4"
        title="Timeless Designs"
        text="Our collections are crafted with a focus on quality and timeless design. Discover pieces that you will cherish for years to come."
      />
      <ContentBlock
        image="https://picsum.photos/800/600?random=5"
        title="Sustainable Fashion"
        text="We are committed to sustainability and ethical practices. Our products are made with eco-friendly materials and processes."
        reverse={true}
      />
    </>
  )
}
