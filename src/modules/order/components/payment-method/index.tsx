"use client"

import { useEffect, useState } from "react"
import * as payment from "@lib/data/payment"
import { RadioGroup } from "@headlessui/react"
import { Button } from "@medusajs/ui"
import Radio from "@modules/common/components/radio"
import { StorePaymentProvider } from "@medusajs/types"

type PaymentMethodSelectorProps = {
  regionId: string
  existingMethodId?: string
  onSelect: (providerId: string) => void
}

export default function PaymentMethodSelector({
  regionId,
  existingMethodId,
  onSelect,
}: PaymentMethodSelectorProps) {
  const [methods, setMethods] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(existingMethodId || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMethods = async () => {
      setLoading(true)
      try {
        const availableMethods : StorePaymentProvider[] = await payment.listCartPaymentMethods(regionId)
        console.log(regionId, availableMethods)
        setMethods(availableMethods)
      } catch (e) {
        console.error("Error fetching payment methods", e)
      } finally {
        setLoading(false)
      }
    }
    fetchMethods()
  }, [regionId])

  if (loading) return <p>Loading payment methods...</p>

  if (!methods.length) return <p>No payment methods available.</p>

  return (
    <div className="flex flex-col gap-y-2 border p-4 rounded-md">
      <h3 className="text-lg font-medium mb-2">Payment Method</h3>

      <RadioGroup
        value={selected}
        onChange={(value: string) => {
          setSelected(value)
          onSelect(value)
        }}
      >
        {methods.map((provider : StorePaymentProvider) => (
          <label key={provider.id} className="flex items-center gap-x-2 mb-2">
            <Radio checked={selected === provider.id} value={provider.id} />
            <span className="text-base-regular capitalize">
              {provider.id.replace("pp_", "").replace(/_/g, " ")}
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
