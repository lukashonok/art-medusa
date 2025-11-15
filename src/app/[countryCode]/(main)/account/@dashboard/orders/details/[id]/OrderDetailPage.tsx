"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { retrieveOrder } from "@lib/data/orders"
import * as payment from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import PaymentProviderSelector from "@modules/checkout/components/payment-provider-selector"

type Props = {
  id: string
}

export default function OrderDetailPage({ id }: Props) {
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null)
  const [paymentData, setPaymentData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderAndPayment = async () => {
      setLoading(true)
      try {
        const fetchedOrder = await retrieveOrder(id)
        if (!fetchedOrder) return notFound()

        setOrder(fetchedOrder)
        console.log("Fetched order:", fetchedOrder)

        const collections = fetchedOrder.payment_collections || []
        if (collections.length > 0) {
          const paymentCollectionId = collections[0].id
          const paymentData = await payment.getPaymentCollection(
            paymentCollectionId,
            fetchedOrder.id
          )
          setPaymentData(paymentData)
        }
      } catch (error) {
        console.error("Error fetching order/payment:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchOrderAndPayment()
  }, [id])

  if (loading) return <div>Loading order details...</div>
  if (!order) return notFound()

  const collections = order.payment_collections || []

  const renderPaymentSection = () => {
    if (!collections.length || !paymentData) return null

    if (collections.length === 1) {
      const col = collections[0]
      return (
        <div className="mt-8">
          <PaymentProviderSelector
            paymentData={paymentData}
            collection_id={col.id}
            order_id={order.id}
          />
        </div>
      )
    }

    return (
      <div className="mt-8 space-y-8">
        {collections.map((col) => (
          <div key={col.id} className="border border-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-2">
              Payment Collection: {col.id}
            </h2>
            <PaymentProviderSelector
              paymentData={paymentData}
              collection_id={col.id}
              order_id={order.id}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full" data-testid="order-detail-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Order Details</h1>
        <p className="text-base-regular">Order #{order.display_id}</p>
      </div>

      {/* === Order Details === */}
      <OrderDetailsTemplate order={order} />
    </div>
  )
}
