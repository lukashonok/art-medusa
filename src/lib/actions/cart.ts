"use server"

import { removeCartId as removeCartIdFromCookies } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"

export async function removeCartId() {
  await removeCartIdFromCookies()
  revalidateTag("cart")
}
