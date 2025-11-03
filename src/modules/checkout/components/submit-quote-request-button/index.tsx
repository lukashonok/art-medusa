"use client"

import { sdk } from "@lib/config"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ErrorMessage from "../error-message"
import { HttpTypes } from "@medusajs/types"
import { removeCartId } from "@lib/actions/cart"

const SubmitQuoteRequestButton = ({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await sdk.client.fetch<{
        draft_order: { id: string }
      }>(`/store/quote-requests`, {
        method: "POST",
        body: {
          cart_id: cart.id,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })

      const { draft_order } = res

      await removeCartId()

      router.push(`/quote-request-confirmation`)
    } catch (error: any) {
      setErrorMessage(error.message || "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleSubmit}
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
        data-testid="submit-quote-button"
      >
        Submit Quote Request
      </Button>
      <ErrorMessage error={errorMessage} data-testid="quote-request-error-message" />
    </>
  )
}

export default SubmitQuoteRequestButton
