import { notFound } from "next/navigation"
import * as payment from "@lib/data/payment"
import Items from "@modules/order/components/items"
import OrderSummary from "@modules/order/components/order-summary"
import OrderDetails from "@modules/order/components/order-details"
import PaymentProviderSelector from "@modules/checkout/components/payment-provider-selector"

type Props = {
  params: Record<string, string>
  searchParams: {
    collection_id: string
    order_id: string
  }
}

export default async function PaymentPage({ searchParams }: Props) {
  const { collection_id, order_id } = searchParams

  if (!collection_id) {
    return notFound()
  }

  const paymentData = await payment.getPaymentCollection(collection_id, order_id)

  if (!paymentData) {
    return notFound()
  }

  const { order, payment_collection, payment_sessions, providers } = paymentData

  if (!order) {
    return notFound()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 content-container gap-x-40 py-12">
      {/* New Client Component */}
      <PaymentProviderSelector
        paymentData={paymentData}
        collection_id={collection_id}
        order_id={order_id}
      />

      {payment_sessions?.length > 0 && (
        <div className="flex flex-col gap-y-8">
          <OrderDetails order={order} />
          <Items order={order} />
          <OrderSummary order={order} />
        </div>
      )}
    </div>
  )
}

