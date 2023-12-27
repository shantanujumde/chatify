"use client";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Animator,
  Fade,
  FadeIn,
  MoveOut,
  ScrollContainer,
  ScrollPage,
  Sticky,
  ZoomIn,
  batch,
} from "react-scroll-motion";

const AboutUs = ({}) => {
  const ZoomInScrollOut = batch(Sticky(), FadeIn(), ZoomIn(), MoveOut(0, -200));

  return (
    <div className="text-2xl">
      <ScrollContainer snap="proximity">
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(Sticky(), Fade(), MoveOut(0, -200))}
          >
            <h1 className="text-6xl font-bold">Welcome to Chatify</h1>
            <p>
              Chatify redefines how you access information stored in documents.
              We bring you a seamless way to engage with your data through
              conversation, enabling effortless retrieval of essential
              information.
            </p>
            <span className="text-right text-2xl">Scroll 👇</span>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p>
              At Chatify, our mission is to simplify the process of information
              retrieval. We aim to empower users by offering an intuitive
              platform where documents become conversation partners, enabling
              you to effortlessly access vital information.
            </p>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-4xl font-bold">
              Chatify&apos;s Unique Offering
            </h2>
            <p>
              Chatify offers you the flexibility to add documents or input
              information manually. Once added, simply chat with Chatify, and it
              will swiftly retrieve the information in a chat format. No more
              sifting through pages or folders; just chat and get the data you
              need instantly.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-4xl font-bold">How Chatify Works</h2>
            <p>
              Our platform integrates advanced AI technology, allowing you to
              converse naturally with your stored documents. Whether you&apos;ve
              uploaded files or typed in information, Chatify&apos;s intelligent
              system comprehends your queries and retrieves precise information,
              presented to you in an easy-to-read chat format.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-4xl font-bold">Meet the Chatify Team</h2>
            <p>
              Behind Chatify is a dynamic team passionate about simplifying
              information access. We&apos;re a group of innovators dedicated to
              crafting a user-friendly experience that streamlines the way you
              interact with your data.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-4xl font-bold">Our Commitment</h2>
            <p>
              Chatify is committed to delivering an exceptional user experience.
              We&apos;re here to support you every step of the way, ensuring
              that accessing your information is not just efficient but also
              enjoyable.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-4xl font-bold">
              Join Chatify&apos;s Revolution
            </h2>
            <p>
              Join us in revolutionizing the way you interact with your
              documents. Experience the simplicity of chatting with your data
              and witness the power of instant information retrieval with
              Chatify.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-5xl font-extrabold">
              Ready to simplify information access?
            </h2>
            <Link
              className={buttonVariants({
                size: "lg",
                className: "mt-5",
              })}
              href="/billing/pricing"
              target="_blank"
            >
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Animator>
        </ScrollPage>
      </ScrollContainer>
    </div>
  );
};

export default AboutUs;
