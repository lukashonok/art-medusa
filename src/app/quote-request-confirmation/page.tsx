import { Metadata } from "next"

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
    </div>
  )
}
