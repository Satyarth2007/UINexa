import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  rightSlot?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, rightSlot, id, className, ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition",
            "placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30",
            Boolean(rightSlot) && "pr-11",
            error ? "border-danger" : "border-border",
            className
          )}
          {...rest}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-1 flex items-center">{rightSlot}</div>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});