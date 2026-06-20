"use client";

import { forwardRef } from "react";
import { Switch as RadixSwitch } from "radix-ui";
import { cn } from "@/lib/utils";

const Switch = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>
>(({ className, ...props }, ref) => (
  <RadixSwitch.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-zinc-700",
      className,
    )}
    ref={ref}
    {...props}
  >
    <RadixSwitch.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </RadixSwitch.Root>
));
Switch.displayName = "Switch";

export { Switch };
