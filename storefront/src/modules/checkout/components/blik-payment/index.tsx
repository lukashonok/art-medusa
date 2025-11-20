"use client"

import { PaymentElement } from "@stripe/react-stripe-js"
import React, { useContext } from "react"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"

const BlikPayment: React.FC = () => {
  const stripeReady = useContext(StripeContext)

  return (
    <div className="my-4 transition-all duration-150 ease-in-out">
      {stripeReady ? (
        <PaymentElement
          options={{
            fields: {
              billingDetails: {
                email: "never",
              },
            },
          }}
        />
      ) : (
        <SkeletonCardDetails />
      )}
    </div>
  )
}

export default BlikPayment
