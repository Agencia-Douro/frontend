"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavLinkDropdownProps {
  trigger: ReactNode;
  items: Array<{
    href: string;
    label: string;
  }>;
}

export default function NavLinkDropdown({ trigger, items }: NavLinkDropdownProps) {
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
            <span
              className={cn(
                "text-black-muted hover:text-black text-center",
                "transition-colors whitespace-nowrap relative",
                "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-gold after:rounded after:scale-x-0",
                "after:origin-left after:transition-transform after:duration-300 after:ease-out",
                "hover:after:scale-x-100 group-data-[state=open]:after:scale-x-100"
              )}
            >
              {trigger}
            </span>
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
                  <NavigationMenuLink href={item.href}>
                    {item.label}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
