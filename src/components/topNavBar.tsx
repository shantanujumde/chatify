"use client";

import Link from "next/link";
import * as React from "react";

import { Icons } from "@/components/ui/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/utils/utils";
import { ChatBubbleIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ModeToggle } from "./mode";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Add PDFs",
    href: "/chatify/documents",
    description: "Add documents to chat with it",
  },
  {
    title: "Chat",
    href: "/chatify/chat",
    description:
      "Type interactive messages to get information form documents you added",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function TopNavBar() {
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const router = useRouter();

  const { data, status } = useSession();
  const [show, setShow] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  const [showMenu, setShowMenu] = React.useState(false);

  const controlNavbar = React.useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY <= 20) {
        setShow(true);
        return;
      }

      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [controlNavbar, lastScrollY]);

  return (
    <NavigationMenu
      dropdownLocation="left"
      className={`fixed inset-x-0 top-5 mx-auto w-11/12 rounded-lg border border-secondary bg-secondary/60 p-2 transition-all duration-500 ease-in-out  ${
        !show ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setShowMenu((curr) => !curr)}
        >
          <HamburgerMenuIcon />
        </Button>
      </div>
      {(showMenu || !isMobile) && (
        <NavigationMenuList className="flex w-full justify-between max-md:flex-col max-md:items-end">
          <div className="flex  gap-1 max-md:flex-col max-md:items-end">
            <NavigationMenuItem className="rounded-xl border border-gray-400/50">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <ChatBubbleIcon />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="rounded-xl border border-gray-400/50">
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Icons.logo className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          shadcn/ui
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components built with Radix UI
                          and Tailwind CSS.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem
                    href="/docs/primitives/typography"
                    title="Typography"
                  >
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {status === "authenticated" && (
              <NavigationMenuItem className="rounded-xl border border-gray-400/50">
                <NavigationMenuTrigger>Utilities</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </div>
          <div className="flex gap-1 max-md:flex-col max-md:items-end">
            {status === "unauthenticated" && (
              <>
                <NavigationMenuItem className="rounded-xl border border-gray-400/50">
                  <Link href="/auth/register" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Register
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="rounded-xl border border-gray-400/50">
                  <Link href="/auth/login" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Login
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
            {status === "authenticated" && (
              <>
                <NavigationMenuItem className="rounded-xl border border-gray-400/50">
                  <Link
                    href={`/profile/${data.user.id}`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Profile
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem className="rounded-xl border border-gray-400/50">
                  <button
                    onClick={() =>
                      void signOut({ redirect: false }).then(async () => {
                        await router.push("/");
                      })
                    }
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Logout
                    </NavigationMenuLink>
                  </button>
                </NavigationMenuItem>
              </>
            )}
            {status === "loading" && (
              <>
                <NavigationMenuItem className="rounded-xl border border-gray-400/50">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Spinner className="h-6 w-6 text-center" />
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="rounded-xl border border-gray-400/50">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Spinner className="h-6 w-6 text-center" />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
            <NavigationMenu dropdownLocation="left">
              <ModeToggle />
            </NavigationMenu>
          </div>
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
