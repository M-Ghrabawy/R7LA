import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-gold bg-gold px-5 py-3 text-abyss hover:bg-[#f0c66a]",
        outline:
          "border border-line-bright bg-transparent px-5 py-3 text-silver hover:border-teal-bright hover:text-white",
        signal:
          "border border-teal bg-teal/10 px-5 py-3 text-teal-bright hover:bg-teal/20",
        ghost:
          "border border-transparent px-3 py-2 text-muted hover:border-line hover:text-silver",
        link: "h-auto gap-1 border-0 bg-transparent p-0 text-teal-bright underline-offset-4 hover:text-gold hover:underline",
      },
      size: {
        default: "min-h-10",
        sm: "min-h-8 px-3 py-1.5 text-[10px]",
        lg: "min-h-12 px-7 py-4",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
