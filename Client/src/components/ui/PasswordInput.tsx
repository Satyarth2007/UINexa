import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";

type Props = Omit<ComponentPropsWithoutRef<typeof Input>, "type" | "rightSlot">;

export const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(
  props,
  ref
) {
  const [show, setShow] = useState(false);

  return (
    <Input
      ref={ref}
      {...props}
      type={show ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="inline-flex size-9 items-center justify-center rounded-md text-muted transition hover:text-foreground"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
});