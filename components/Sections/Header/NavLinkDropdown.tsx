"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "@/i18n/navigation";
import NavLink from "./NavLink";

interface NavLinkDropdownProps {
  trigger: string;
  triggerHref?: string;
  items: Array<{
    href: string;
    label: string;
  }>;
  isTransparent?: boolean;
}

export default function NavLinkDropdown({ trigger, triggerHref, items, isTransparent }: NavLinkDropdownProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-0">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "group flex items-center gap-1 button-14-medium",
              "bg-transparent hover:bg-transparent focus:bg-transparent",
              "p-0 h-auto border-0 shadow-none",
              "data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent",
              "focus-visible:ring-0 focus-visible:outline-none",
              "cursor-pointer"
            )}
          >
            {triggerHref ? (
              <NavLink href={triggerHref} isTransparent={isTransparent}>{trigger}</NavLink>
            ) : (
              <span className={cn(
                isTransparent ? "text-white/90 hover:text-white" : "text-black-muted hover:text-black",
                "text-center transition-colors whitespace-nowrap relative",
                "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-gold after:rounded after:scale-x-0",
                "after:origin-left after:transition-transform after:duration-300 after:ease-out",
                "hover:after:scale-x-100"
              )}>{trigger}</span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-gold transition-transform duration-300 group-data-[state=open]:rotate-180"
            >
              <path
                d="M8.00042 8.78101L11.3003 5.4812L12.2431 6.42401L8.00042 10.6667L3.75781 6.42401L4.70062 5.4812L8.00042 8.78101Z"
                fill="currentColor"
              />
            </svg>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
              {items.map((item) => (
                <li key={item.href} className="list-none">
                  <Link
                    href={item.href}
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
