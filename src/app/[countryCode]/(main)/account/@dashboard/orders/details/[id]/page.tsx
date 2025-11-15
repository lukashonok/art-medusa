
import { retrieveOrder } from "@lib/data/orders"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import OrderDetailPage from "./OrderDetailPage"

type Props = {
  params: { id: string }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Order #${order.display_id}`,
    description: `View your order`,
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  return <OrderDetailPage id={resolvedParams.id} />
}

