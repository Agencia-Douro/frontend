import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "flex justify-between w-full items-center body-14-regular text-black-muted text-black-muted w-full shadow-pretty placeholder:text-grey bg-white px-2 py-1.5 body-14-medium outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9",
                className
            )}
            {...props}
        />
    )
}

export { Textarea }
