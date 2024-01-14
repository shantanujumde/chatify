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
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode";
import { Button } from "./ui/button";

import Spinner from "./ui/spinner";

export function TopNavBar() {
  const { data, status } = useSession();

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Knowledge Base",
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
      title: "Manage Subscription",
      href: `/billing/manage/${data?.user.id}`,
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
      title: "Team",
      href: "/profile/invite-users",
      description: "Invite users to who can access knowledge base",
    },
  ];
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const router = useRouter();

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

  const buttonLoader = (
    <NavigationMenuItem className="rounded-xl border border-gray-400/50">
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        <Spinner className="h-6 w-6 text-center" />
      </NavigationMenuLink>
    </NavigationMenuItem>
  );

  return (
    <NavigationMenu
      dropdownLocation="left"
      className={`fixed inset-x-0 top-5 mx-auto w-11/12 rounded-lg border border-secondary bg-secondary p-2  transition-all duration-500 ease-in-out dark:bg-black  ${
        !show ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] h-[25rem] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
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
            {/* <NavigationMenuItem className="p-0">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Icons.logo className="h-8 w-8 dark:fill-white" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}

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
                        <Icons.logo className="z-10 dark:fill-white" />
                        <div className="mb-2 mt-4 text-center text-lg font-medium">
                          Chatify
                        </div>
                        <p className="text-center text-sm leading-tight text-muted-foreground">
                          Worlds best tool to create knowledge-base and
                          understand the data properly.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Introduction">
                    Know how to use Chatify. Step by step instruction guide.
                  </ListItem>
                  <ListItem href="/docs/about-us" title="About Us">
                    Know about chatify team and contributors.
                  </ListItem>
                  <ListItem href="/docs/privacy-policy" title="Privacy Policy">
                    Know about chatify privacy policy.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {status === "loading" && buttonLoader}
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
                      void signOut({ redirect: false }).then(() => {
                        router.push("/");
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
                {buttonLoader}
                {buttonLoader}
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
