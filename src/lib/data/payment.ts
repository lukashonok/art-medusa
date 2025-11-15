"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes, StorePaymentProvider } from "@medusajs/types"

export type PaymentSessionResponse = {
  order: HttpTypes.StoreOrder | null
  payment_collection: HttpTypes.StorePaymentCollection
  payment_sessions: HttpTypes.StorePaymentSession[]
  providers: HttpTypes.StorePaymentProvider[]
}

/**
 * Fetches a payment collection (and related order/sessions)
 * - If payment sessions don't exist, they will be created server-side
 */
export const getPaymentCollection = async (
  collectionId: string,
  orderId: string,
  providerId?: string
): Promise<PaymentSessionResponse | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_collections")),
  }

  const queryParams = new URLSearchParams({
    collection_id: collectionId,
    ...(orderId ? { order_id: orderId } : {}),
    ...(providerId ? { provider_id: providerId } : {}),
  }).toString()

  
  try {
    const { order, payment_collection, payment_sessions, providers } = await sdk.client.fetch<
      PaymentSessionResponse
    >(`/store/get-payment-collection?${queryParams}`, {
      method: "GET",
      headers,
      next,
      cache: "no-store", // use fresh data for payments
    })

    return { order, payment_collection, payment_sessions, providers }
  } catch (err) {
    console.error("Failed to fetch payment collection:", err)
    return null
  }
}


export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      `/store/payment-providers`,
      {
        method: "GET",
        query: { region_id: regionId },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return [] as StorePaymentProvider[]
    })
}
