"use client"

import { PaymentElement } from "@stripe/react-stripe-js"
import React from "react"

const BlikPayment: React.FC = () => {
  return (
    <div className="my-4 transition-all duration-150 ease-in-out">
      <PaymentElement
        options={{
          fields: {
            billingDetails: {
              email: "never",
            },
          },
        }}
      />
    </div>
  )
}

export default BlikPayment
