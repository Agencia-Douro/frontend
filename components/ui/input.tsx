import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-black-muted w-full shadow-pretty placeholder:text-grey bg-white px-2 py-1.5 body-14-medium outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9",
        className
      )}
      {...props}
    />
  )
}

export { Input }
