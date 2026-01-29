import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  hasArrow?: boolean;
  isTransparent?: boolean;
}

export default function NavLink({ href, children, hasArrow, isTransparent }: NavLinkProps) {
  return (
    <Link
      href={href} className="group flex items-center gap-1 button-14-medium">
        <span className={cn(
        isTransparent ? "text-white/90 hover:text-white" : "text-black-muted hover:text-black",
        "text-center transition-colors whitespace-nowrap relative",
        "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-gold after:rounded after:scale-x-0",
        "after:origin-left after:transition-transform after:duration-300 after:ease-out",
        "hover:after:scale-x-100"
      )}>{children}</span>
      {hasArrow && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-gold">
          <path d="M8.00042 8.78101L11.3003 5.4812L12.2431 6.42401L8.00042 10.6667L3.75781 6.42401L4.70062 5.4812L8.00042 8.78101Z" fill="currentColor"/>
        </svg>
      )}
    </Link>
  );
}
