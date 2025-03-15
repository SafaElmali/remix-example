import { cva } from "class-variance-authority";
import { FC } from "react";

const statusBadgeVariants = cva(
  "px-2.5 py-0.5 text-xs font-medium rounded-full border",
  {
    variants: {
      status: {
        alive: "bg-green-100 text-green-800 border-green-200",
        dead: "bg-red-100 text-red-800 border-red-200",
        unknown: "bg-gray-100 text-gray-800 border-gray-200",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-1",
        lg: "text-base px-3 py-1.5",
      },
    },
    defaultVariants: {
      status: "unknown",
      size: "sm",
    },
  }
);

type CharacterStatusProps = {
  status: "alive" | "dead" | "unknown";
  size?: "sm" | "md" | "lg";
};

const CharacterStatus: FC<CharacterStatusProps> = ({ status, size = "sm" }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600">Status:</span>
      <span className={statusBadgeVariants({ status, size })}>{status}</span>
    </div>
  );
};

export { CharacterStatus };
