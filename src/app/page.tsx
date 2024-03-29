import RevealOnScroll from "@/components/RevealOnScroll";
import InvitationDialog from "@/components/invitationDialog";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "../components/ui/icons";
import { BRAND_NAME } from "../utils/utils";

// t3- https://www.youtube.com/watch?v=J1gzN1SAhyM
// embeddings and chatbot- https://www.youtube.com/watch?v=RM-v7zoYQo0

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      <a
        href="https://Github.com/shantanujumde/chatify"
        className="mx-auto mb-4 flex max-w-fit cursor-pointer items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50"
      >
        <p className="text-sm font-semibold text-gray-700">
          <Icons.logoShort className="inline h-5 w-5" /> is proudly open-source
          on Github ❤️
        </p>
      </a>
      <div className="-mt-24 flex h-screen flex-col items-center justify-center">
        <h1 className="max-w-4xl text-center text-5xl font-bold md:text-6xl lg:text-7xl">
          {BRAND_NAME} makes <span className="text-primary">understand </span>
          data easy!
        </h1>
        <p className="mt-5 max-w-prose text-center text-zinc-700 dark:text-zinc-400 sm:text-lg">
          Worlds best tool to understand any data easily with chat interface.
        </p>

        <Link
          href={session?.user ? "/billing/pricing" : "/auth/login"}
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
        >
          {session?.user ? "Activate free trial" : "Sign-Up Now"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <p className="mt-5 max-w-prose text-center text-zinc-700 dark:text-zinc-400 sm:text-lg">
          Unlock the full potential of {BRAND_NAME} with our{" "}
          <span className="font-bold">Exclusive UNLIMITED Free </span>
          trial*. Experience the power of seamless information retrieval,
          collaborative knowledge sharing, and priority support, all at no cost.
          Dive in today and elevate your productivity with {BRAND_NAME} – where
          innovation meets efficiency. Sign up now for your complimentary
          unlimited trial and discover a new era of effortless communication and
          data access.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 left-0 top-[80%] -z-10 transform-gpu overflow-hidden  md:top-[90%] lg:top-3/4 "
      >
        <div
          style={{
            clipPath: "polygon(0 44%, 100% 0, 100% 100%, 0% 100%)",
          }}
          className="relative  aspect-[0.8] w-screen  bg-primary md:aspect-[1155/998] lg:aspect-[1155/798]"
        />
      </div>

      <RevealOnScroll>
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">
              Explore knowledge base just by asking questions
            </h2>
            <p className="mt-4 text-lg  text-zinc-700">
              Share, Learn, Prompt questions to your knowledge base was never
              easier before.
            </p>
          </div>
        </div>
      </RevealOnScroll>

      {/* steps */}

      <RevealOnScroll>
        <ol className="my-8 space-y-4 rounded-xl bg-white p-8 dark:bg-black md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <RevealOnScroll>
              <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary/70">
                  Step 1
                </span>
                <span className="text-xl font-semibold">
                  Sign up for an account
                </span>
                <span className="mt-2 text-zinc-700 dark:text-zinc-400">
                  Either starting out with a free plan or choose our{" "}
                  <Link
                    href="billing/pricing"
                    className="text-primary underline underline-offset-2"
                  >
                    pro plan
                  </Link>
                  .
                </span>
              </div>
            </RevealOnScroll>
          </li>
          <li className="md:flex-1">
            <RevealOnScroll>
              <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary/70">
                  Step 2
                </span>
                <span className="text-xl font-semibold">
                  Upload your files.
                </span>
                <span className="mt-2 text-zinc-700 dark:text-zinc-400">
                  We&apos;ll process your file and make it ready for you to chat
                  with.
                </span>
              </div>
            </RevealOnScroll>
          </li>
          <li className="md:flex-1">
            <RevealOnScroll>
              <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary/70">
                  Step 3
                </span>
                <span className="text-xl font-semibold">
                  Start asking questions
                </span>
                <span className="mt-2 text-zinc-700 dark:text-zinc-400">
                  It&apos;s that simple. Try out {BRAND_NAME} today - it really
                  takes less than a minute.
                </span>
              </div>
            </RevealOnScroll>
          </li>
        </ol>
      </RevealOnScroll>

      {/* Usecases section */}
      <div className="relative isolate mt-10 flex flex-col gap-8 max-sm:text-center md:text-left">
        <RevealOnScroll>
          <div className="flex items-center gap-4 max-sm:flex-col md:flex-row">
            <div className="w-3/4 p-8 max-sm:w-full">
              <h2 className="text-5xl font-semibold italic">
                Onboard new employees faster.
              </h2>
              <blockquote className="text-xl font-semibold italic text-gray-900 dark:text-gray-200">
                <p className="mt-4 max-sm:pl-0 md:pl-8">
                  Onboarding new employees can be a time-consuming process. With{" "}
                  {BRAND_NAME}, you can provide new employees with the
                  information they need to get started quickly and easily.
                </p>
              </blockquote>
            </div>
            <div className="w-1/4 max-sm:w-full">
              <Image
                src="/onboardingOwl.webp"
                alt="uploading preview"
                width={350}
                height={350}
                quality={100}
                className="m-auto rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="flex items-center gap-4 max-sm:flex-col-reverse md:flex-row">
            <div className="w-1/4 max-sm:w-full">
              <Image
                src="/chattingOwl.webp"
                alt="uploading preview"
                width={350}
                height={350}
                quality={100}
                className="m-auto rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>

            <div className="w-3/4 p-8 max-sm:w-full">
              <h2 className="text-5xl font-semibold italic">
                Get insights easily.
              </h2>
              <blockquote className="text-xl font-semibold italic text-gray-900 dark:text-gray-300">
                <p className="mt-4 max-sm:pl-0 md:pl-8">
                  Chat with your data, and get insights easily. {BRAND_NAME} is
                  a powerful tool that allows you to ask questions and get
                  answers from your data in real-time.
                </p>
              </blockquote>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="flex items-center gap-4 max-sm:flex-col md:flex-row">
            <div className="w-3/4 p-8 max-sm:w-full">
              <h2 className="text-5xl font-semibold italic">
                Manage your team&apos;s knowledge.
              </h2>
              <blockquote className="text-xl font-semibold italic text-gray-900 dark:text-gray-200">
                <p className="mt-4 max-sm:pl-0 md:pl-8">
                  {BRAND_NAME} allows you to create a knowledge base for your
                  team. You can easily share information, ask questions, and
                  collaborate with your team to find the answers you need.
                </p>
              </blockquote>
            </div>
            <div className="w-1/4 max-sm:w-full">
              <Image
                src="/owlOnBooks.webp"
                alt="uploading preview"
                width={350}
                height={350}
                quality={100}
                className="m-auto rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
      <div className="relative isolate">
        <RevealOnScroll>
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="/chat.webp"
                  alt="uploading preview"
                  width={1419}
                  height={732}
                  quality={100}
                  className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
                />
                <p className="-mt-3 w-full rounded-b-2xl bg-white py-1 text-center text-dark ring-1 ring-inset ring-gray-900/10 sm:text-lg">
                  Chat with your data, and get insights easily.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
      {/* Feature section */}
      <div className="mx-auto mb-32 mt-32 sm:mt-56">
        <RevealOnScroll>
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="/addDocuments.webp"
                  alt="uploading preview"
                  width={1419}
                  height={732}
                  quality={100}
                  className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
                />
                <p className="-mt-3 w-full rounded-b-2xl bg-white py-1 text-center text-dark ring-1 ring-inset ring-gray-900/10 sm:text-lg">
                  Add documents with few simple clicks.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
      <InvitationDialog />
    </>
  );
}
