"use client"

import { paymentInfoMap } from "@lib/constants"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { StripeCardContainer } from "@modules/checkout/components/payment-container"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useState } from "react"
import SubmitSpinner from "@modules/checkout/components/submit-spinner"

const PaymentStripe = ({
  paymentSession,
  onCardCompleteChange,
}: {
  paymentSession: any
  onCardCompleteChange: (complete: boolean) => void
}) => {
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          Payment
          <CheckCircleSolid />
        </Heading>
      </div>
      <div>
        <div className="block">
          <StripeCardContainer
            paymentProviderId={paymentSession.provider_id}
            selectedPaymentOptionId={paymentSession.provider_id}
            paymentInfoMap={paymentInfoMap}
            setCardBrand={setCardBrand}
            setError={setError}
            setCardComplete={onCardCompleteChange}
          />

          <ErrorMessage error={error} data-testid="payment-method-error-message" />
        </div>
      </div>
    </div>
  )
}

export default PaymentStripe
