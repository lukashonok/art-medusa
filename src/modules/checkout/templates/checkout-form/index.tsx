"use client"

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function CheckoutForm({
  cart: cartProp,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  const searchParams = useSearchParams()
  const [cart, setCart] = useState(cartProp)
  const [shippingMethods, setShippingMethods] = useState<
    HttpTypes.StoreCartShippingOption[] | undefined
  >()
  const [paymentMethods, setPaymentMethods] = useState<
    HttpTypes.StorePaymentMethod[] | undefined
  >()

  const step = searchParams.get("step")

  useEffect(() => {
    if (!cart) {
      return
    }

    listCartShippingMethods(cart.id).then((methods) =>
      setShippingMethods(methods)
    )
    listCartPaymentMethods(cart.region?.id ?? "").then((methods) =>
      setPaymentMethods(methods)
    )
  }, [cart])

  if (!cart) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      {step === "delivery" && (
        <Shipping cart={cart} availableShippingMethods={shippingMethods ?? []} />
      )}

      {step === "payment" && (
        <Payment cart={cart} availablePaymentMethods={paymentMethods ?? []} />
      )}

      {step === "review" && (
        <Review cart={cart} />
      )}
    </div>
  )
}
