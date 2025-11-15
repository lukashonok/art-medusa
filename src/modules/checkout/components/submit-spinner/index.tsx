import { EllipsisHorizontal } from "@medusajs/icons"

const SubmitSpinner = () => {
  return (
    <div className="w-full flex items-center justify-center text-ui-fg-base" data-testid="submit-spinner">
      <div className="flex items-center gap-x-2 txt-compact-xsmall-plus animate-pulse">
        <EllipsisHorizontal />
        <span>Processing...</span>
      </div>
    </div>
  )
}

export default SubmitSpinner
