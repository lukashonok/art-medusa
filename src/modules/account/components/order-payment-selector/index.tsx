"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@medusajs/ui"
import * as payment from "@lib/data/payment"
import { RadioGroup } from "@headlessui/react"
import Radio from "@modules/common/components/radio"
import { HttpTypes } from "@medusajs/types"

type OrderPaymentSelectorProps = {
  order: HttpTypes.StoreOrder
}

export default function OrderPaymentSelector({ order }: OrderPaymentSelectorProps) {
  const router = useRouter()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (order?.region_id) {
        try {
          const methods = await payment.listCartPaymentMethods(order.region_id)
          setPaymentMethods(methods)
        } catch (error) {
          console.error("Error fetching payment methods:", error)
          // Handle error appropriately, maybe show a message to the user
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false) // No region_id, so no payment methods to fetch
      }
    }

    fetchPaymentMethods()
  }, [order?.region_id])

  const handleContinueToPayment = () => {
    if (selectedProvider && order?.payment_collection?.id) {
      router.push(
        `/payment?collection_id=${order.payment_collection.id}&order_id=${order.id}&provider_id=${selectedProvider}`
      )
    }
  }

  // If order is already paid, display a message and disable payment options
  if (order.payment_status === "paid" || order.fulfillment_status === "fulfilled") {
    return (
      <div className="mt-8 p-4 border border-green-500 rounded-md bg-green-50">
        <p className="text-green-700 font-semibold">Order is already paid and fulfilled.</p>
      </div>
    )
  }

  if (loading) {
    return <div>Loading payment options...</div>
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="mt-8 p-4 border border-red-500 rounded-md bg-red-50">
        <p className="text-red-700 font-semibold">No payment methods available for this order.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl-semi mb-4">Payment Method</h2>
      <RadioGroup
        value={selectedProvider}
        onChange={(value: string) => setSelectedProvider(value)}
      >
        {paymentMethods.map((provider) => (
          <label key={provider.id} className="flex items-center gap-x-2 mb-2">
            <Radio
              checked={selectedProvider === provider.id}
              value={provider.id}
            />
            <span className="text-base-regular">
              {provider.id.replace("pp_", "").replace("_stripe", "").replace(/_/g, " ")}
            </span>
          </label>
        ))}
      </RadioGroup>
      <Button
        className="mt-4"
        onClick={handlePaymentNavigation}
        disabled={!selectedProvider}
      >
        Continue to Payment
      </Button>
    </div>
  )
}
