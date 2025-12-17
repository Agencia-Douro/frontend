import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex justify-between w-full items-center body-14-regular text-black-muted py-2 border-b border-b-gold placeholder:text-grey px-0 data-[state=open]:border-b-brown group focus-within:outline-none focus-within:border-b-brown",
        className
      )}
      {...props}
    />
  )
}

export { Input }
