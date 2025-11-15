"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import PaymentStripe from "../payment-stripe"

type StripePaymentFormProps = {
  paymentSession: any
  order_id: string
}

export default function StripePaymentForm({
  paymentSession,
  order_id,
}: StripePaymentFormProps) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [cardCompleteState, setCardCompleteState] = useState(false)

  const handleSubmit = async () => {
    if (!stripe || !elements || !paymentSession?.data?.client_secret) {
      return
    }

    const { error } = await stripe.confirmCardPayment(
      paymentSession.data.client_secret as string,
      {
        payment_method: {
          card: elements.getElement('card')!,
        },
      }
    )

    if (error) {
      console.error("Payment confirmation failed:", error)
      // TODO: Display error to user
    } else {
      router.push(`/order/${order_id}/confirmed`)
    }
  }

  return (
    <>
      <PaymentStripe paymentSession={paymentSession} onCardCompleteChange={setCardCompleteState} />
      <Button
        className="mt-4"
        onClick={handleSubmit}
        disabled={!cardCompleteState || !stripe || !elements}
      >
        Pay Now
      </Button>
    </>
  )
}
