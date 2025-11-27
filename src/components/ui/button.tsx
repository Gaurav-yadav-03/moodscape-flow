import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-soft hover:shadow-medium rounded-xl hover:scale-[1.02]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium rounded-xl",
        outline: "border border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-soft rounded-xl hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium rounded-xl",
        ghost: "hover:bg-muted/50 rounded-xl hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-warm text-white hover:opacity-90 shadow-medium hover:shadow-strong rounded-xl font-medium hover:scale-[1.02]",
        glass: "glass-effect text-foreground hover:bg-white/30 backdrop-blur-md rounded-xl border-white/20",
        mood: "rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all hover:scale-105 bg-card border border-border/50",
        floating: "fixed bottom-6 right-6 bg-primary text-primary-foreground hover:bg-primary-dark shadow-strong hover:shadow-strong rounded-full z-50 animate-float"
      },
      size: {
        default: "h-11 px-6 py-3 text-sm",
        sm: "h-9 px-4 py-2 text-sm rounded-lg",
        lg: "h-13 px-8 py-4 text-base rounded-xl",
        icon: "h-11 w-11 rounded-xl",
        floating: "h-14 w-14 rounded-full"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
