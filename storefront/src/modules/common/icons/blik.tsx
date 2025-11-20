import React from "react"
import { IconProps } from "types/icon"

const Blik: React.FC<IconProps> = ({ size = "20", ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="currentColor"
      >
        BLIK
      </text>
    </svg>
  )
}

export default Blik
