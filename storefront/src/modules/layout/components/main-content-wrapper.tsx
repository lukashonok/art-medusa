"use client"

import { usePathname } from "next/navigation"
import React from "react"

const MainContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isHomePage = pathname.split("/").length <= 2

  return <div className={!isHomePage ? "pt-16" : ""}>{children}</div>
}

export default MainContentWrapper
