"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PaymentMethodSelector from "../payment-method"

type Props = {
  order: HttpTypes.StoreOrder
}

const PaymentButton = ({ order }: Props) => {
  const collection = order.payment_collections?.[0]
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  // Skip rendering if already paid or no payment collection
  if (order.payment_status !== "not_paid" || !collection) {
    return null
  }

  const href = `/payment?order_id=${order.id}&collection_id=${collection.id}${
    selectedProvider ? `&provider_id=${selectedProvider}` : ""
  }`

  const isDisabled = !selectedProvider

  return (
    <div className="mt-6 flex flex-col gap-y-4">
      {/* === Payment Method Selector === */}
      <PaymentMethodSelector
        regionId={order.region_id}
        existingMethodId={selectedProvider ?? undefined}
        onSelect={(providerId) => setSelectedProvider(providerId)}
      />

      {/* === Pay Button === */}
      {isDisabled ? (
        <button
          className="w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
          disabled
        >
          Select payment method first
        </button>
      ) : (
        <LocalizedClientLink href={href} className="w-full">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Pay for order
          </button>
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default PaymentButton
