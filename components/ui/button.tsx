import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        brown: "button-14-semibold bg-brown hover:bg-brown-muted text-white",
        red: "button-14-semibold bg-red hover:bg-red/90 text-white",
        gold: "button-14-semibold bg-gold hover:bg-gold-muted text-white",
        ghost: "button-14-medium text-black-muted",
        "icon-brown": "border border-brown hover:bg-brown",
        outline: "button-14-semibold border border-brown text-brown hover:bg-brown hover:text-white",
        muted: "body-14-medium bg-muted text-brown hover:bg-brown hover:bg-[#EDE3D7] [&>svg]:text-brown [&_svg]:hover:text-white",
      },
      size: {
        default: "px-3 py-2",
        icon: "h-9 w-12",
      }
    },
    defaultVariants: {
      variant: "brown",
      size: "default"
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), "cursor-pointer")}
      {...props}
    />
  )
}

export { Button, buttonVariants }
