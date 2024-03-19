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
import { BRAND_NAME, CONTACT_US_EMAIL } from "../../../utils/utils";

const PrivacyPolicy = ({}) => {
  const ZoomInScrollOut = batch(Sticky(), FadeIn(), ZoomIn(), MoveOut(0, -200));

  return (
    <div className="text-2xl">
      <ScrollContainer snap="proximity">
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(Sticky(), Fade(), MoveOut(0, -200))}
          >
            <h1 className="text-6xl font-bold">{BRAND_NAME} Privacy Policy</h1>
            <p>
              Welcome to {BRAND_NAME}! This Privacy Policy is designed to help
              you understand how we collect, use, and safeguard your information
              when you use our services.
            </p>
            <span className="text-right text-2xl">Scroll 👇</span>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <p>Information We Collect</p>
            <h2 className="text-3xl font-bold">
              1. User-Provided Information:
            </h2>
            <p>
              When you sign up for {BRAND_NAME}, we collect personal information
              such as your name, email address, and any other information you
              choose to provide.
            </p>
            <h2 className="text-3xl font-bold">2. Uploaded Documents:</h2>
            <p>
              Documents you upload to {BRAND_NAME} are stored securely on our
              servers. We do not access the content of your documents unless
              explicitly requested by you through the {BRAND_NAME} interface.
            </p>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <p>How We Use Your Information</p>
            <h2 className="text-4xl font-bold">1. Communication:</h2>
            <p>
              We use your contact information to communicate with you about your
              account, updates, and important announcements.
            </p>
            <h2 className="text-4xl font-bold">2. Service Improvement:</h2>
            <p>
              We may use aggregated and anonymized data to improve our services,
              troubleshoot issues, and enhance user experience.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <p>Data Security</p>
            <h2 className="text-4xl font-bold">1. Encryption:</h2>
            <p>
              Your data, both personal information and uploaded documents, is
              transmitted securely using encryption protocols.
            </p>
            <h2 className="text-4xl font-bold">2. Access Controls:</h2>
            <p>
              Access to user data is restricted to authorized personnel only. We
              implement strict access controls to ensure the confidentiality and
              integrity of your information.
            </p>
            <h2 className="text-4xl font-bold">3. Sharing:</h2>
            <p>
              App only makes request to openAi to generate a response. We do not
              store any of the information that you provide to openAi.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <p>Your Choices</p>
            <h2 className="text-4xl font-bold">1. Account Settings:</h2>
            <p>
              You have control over the information you provide. You can review
              and update your account information through the {BRAND_NAME}{" "}
              platform.
            </p>
            <h2 className="text-4xl font-bold">
              2. Communication Preferences:
            </h2>
            <p>
              You can manage your communication preferences, including opting
              out of non-essential communications.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <p>Information Sharing</p>
            <h2 className="text-4xl font-bold">1. Third-Party Services:</h2>
            <p>
              We do not share your personal information or uploaded documents
              with third parties unless required by law or with your explicit
              consent.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <p>Changes to This Privacy Policy</p>
            <h2 className="text-4xl font-bold">1. Updates:</h2>
            <p>
              We may update this Privacy Policy to reflect changes in our
              practices or for other operational, legal, or regulatory reasons.
            </p>
            <h2 className="text-4xl font-bold">2. Notification:</h2>
            <p>
              Users will be notified of any significant changes to this Privacy
              Policy through email or a notice on our website.
            </p>
          </Animator>
        </ScrollPage>
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-5xl font-extrabold">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at {CONTACT_US_EMAIL}.
            </p>
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
        <ScrollPage>
          <Animator
            className="flex flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <h2 className="text-4xl font-bold">Acceptance of Terms</h2>
            <p>
              By using {BRAND_NAME}, you signify your acceptance of this Privacy
              Policy. If you do not agree to this policy, please do not use our
              services.
            </p>
          </Animator>
        </ScrollPage>
      </ScrollContainer>
    </div>
  );
};

export default PrivacyPolicy;
