"use client";

import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger showChevronDown={false}>
        <>
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </>
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <ul className="flex cursor-pointer flex-col p-4">
          <NavigationMenuLink onClick={() => setTheme("light")}>
            Light
          </NavigationMenuLink>
          <NavigationMenuLink onClick={() => setTheme("dark")}>
            Dark
          </NavigationMenuLink>
          <NavigationMenuLink onClick={() => setTheme("system")}>
            System
          </NavigationMenuLink>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
