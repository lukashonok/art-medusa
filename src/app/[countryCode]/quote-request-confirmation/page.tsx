import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Quote Request Confirmation",
  description: "Your quote request has been received.",
}

export default function QuoteRequestConfirmation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi">Quote Request Received!</h1>
      <p className="mt-4 text-base-regular">
        Thank you for your quote request. We have received your request and will contact you shortly to discuss pricing.
      </p>
      <LocalizedClientLink href="/">
        <Button className="mt-4">Go to main page</Button>
      </LocalizedClientLink>
    </div>
  )
}
