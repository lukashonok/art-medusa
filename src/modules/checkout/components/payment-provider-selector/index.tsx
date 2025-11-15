"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@medusajs/ui"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentSessionResponse } from "@lib/data/payment"
import StripePaymentForm from "@modules/checkout/components/stripe-payment-form"
import StripeWrapper from "../payment-wrapper/stripe-wrapper"
import PaymentStripe from "../payment-stripe"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

type PaymentProviderSelectorProps = {
  paymentData: PaymentSessionResponse
  collection_id: string
  order_id: string
}

export default function PaymentProviderSelector({
  paymentData,
  collection_id,
  order_id,
}: PaymentProviderSelectorProps) {
  const router = useRouter()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  const { payment_sessions, providers } = paymentData

  const handleCreateSession = async () => {
    if (selectedProvider) {
      router.push(`?collection_id=${collection_id}&order_id=${order_id}&provider_id=${selectedProvider}`)
    }
  }

  if (!payment_sessions?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h1 className="text-2xl-semi">Select a Payment Provider</h1>
        <div className="flex flex-col gap-y-4 mt-4">
          <label key={providers[0].id} className="flex items-center gap-x-2">
              <input
                type="radio"
                name="paymentProvider"
                value={providers[0].id}
                checked={selectedProvider === providers[0].id}
                onChange={() => setSelectedProvider(providers[0].id)}
              />
              <span>
                {providers[0].id
                  .replace("pp_", "")
                  .replace(/_stripe$/, "")
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </label>

          {/* {providers.map((provider) => (
            <label key={provider.id} className="flex items-center gap-x-2">
              <input
                type="radio"
                name="paymentProvider"
                value={provider.id}
                checked={selectedProvider === provider.id}
                onChange={() => setSelectedProvider(provider.id)}
              />
              <span>
                {provider.id
                  .replace("pp_", "")
                  .replace(/_stripe$/, "")
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </label>
          ))} */}
        </div>
        <Button className="mt-4" onClick={handleCreateSession} disabled={!selectedProvider}>
          Continue
        </Button>
      </div>
    )
  }

  const paymentSession = payment_sessions[0]

  return (
    <div className="flex flex-col gap-y-8">
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        <PaymentStripe paymentSession={paymentSession} setCardComplete={setCardComplete} />
        {/* <StripePaymentForm
          paymentSession={paymentSession}
          order_id={order_id}
          setCardComplete={setCardComplete}
        /> */}
      </StripeWrapper>
    </div>
  )
}
