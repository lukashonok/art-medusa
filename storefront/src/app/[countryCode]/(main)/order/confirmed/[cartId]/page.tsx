"use client"

import { placeOrder } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

function OrderConfirmed() {
  const { cartId } = useParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cartId) {
      placeOrder(cartId as string).catch((e) => {
        setError(e.message)
      })
    }
  }, [cartId])

  if (error) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-96">
        <h1 className="text-2xl-semi">Something went wrong</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-96">
      <h1 className="text-2xl-semi">Please wait...</h1>
      <p>
        Your order is being processed. You will be redirected shortly.
      </p>
    </div>
  )
}

export default OrderConfirmed
