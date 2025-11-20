import { Metadata } from "next"
import ContentBlock from "@modules/home/components/content-block"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our company and our mission.",
}

export default function AboutUs() {
  return (
    <div className="pt-16"> {/* Add padding top to account for fixed header */}
      <div className="content-container py-12">
        <Heading level="h1" className="text-4xl text-center mb-12">
          About Us
        </Heading>
      </div>
      <ContentBlock
        image="https://picsum.photos/800/600?random=1"
        title="Our Story"
        text="Founded in 2023, our company started with a vision to provide high-quality products with a focus on sustainability and customer satisfaction. We believe in creating lasting value for our community."
      />
      <ContentBlock
        image="https://picsum.photos/800/600?random=2"
        title="Our Mission"
        text="Our mission is to empower individuals through innovative and ethically sourced products. We strive to make a positive impact on the world, one product at a time."
        reverse={true}
      />
      <ContentBlock
        image="https://picsum.photos/800/600?random=3"
        title="Meet the Team"
        text="Behind every great product is a passionate team. Get to know the dedicated individuals who make our vision a reality. We are a diverse group united by a common goal."
      />
    </div>
  )
}
