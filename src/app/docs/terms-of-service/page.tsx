"use client";

import { BRAND_NAME } from "../../../utils/utils";

const TermsOfService = ({}) => {
  return (
    <div className="flex flex-col gap-20 text-xl">
      <div>
        <h1 className="my-8 text-6xl font-bold">
          {BRAND_NAME} - Terms of Service
        </h1>
        These Terms of Service ("Terms") govern your access to and use of the
        {BRAND_NAME} application and services provided by {BRAND_NAME}. By
        accessing or using {BRAND_NAME}, you agree to be bound by these Terms.
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">1. Acceptance of Terms</h2>
        <p>
          By accessing or using {BRAND_NAME}, you agree to be bound by these
          Terms. If you do not agree to all the terms and conditions of this
          agreement, you may not access or use {BRAND_NAME}.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">2. Use of {BRAND_NAME}</h2>
        <p>
          2.1. You may use {BRAND_NAME} solely for your personal or internal
          business purposes and in compliance with these Terms.
        </p>
        <p>
          2.2. You agree not to access or use {BRAND_NAME} for any unlawful
          purpose or in a manner that violates any applicable laws or
          regulations.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">3. User Accounts</h2>
        <p>
          3.1. You may need to create an account to access certain features of
          {BRAND_NAME}. You are responsible for maintaining the security of your
          account and for all activities that occur under your account.
        </p>
        <p>
          3.2. You agree to provide accurate and complete information when
          creating an account and to update such information as necessary.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">4. Intellectual Property</h2>
        <p>
          4.1. {BRAND_NAME} and its original content, features, and
          functionality are owned by {BRAND_NAME} and are protected by
          international copyright, trademark, patent, trade secret, and other
          intellectual property or proprietary rights laws.
        </p>
        <p>
          4.2. You may not modify, reproduce, distribute, create derivative
          works of, publicly display, publicly perform, republish, download,
          store, or transmit any of the material on {BRAND_NAME}, except as
          necessary for your personal or internal business use.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">5. Privacy</h2>
        <p>
          5.1. Our Privacy Policy governs the collection, use, and disclosure of
          your personal information by {BRAND_NAME}. By accessing or using
          Onboard Owl, you consent to the collection, use, and disclosure of
          your personal information in accordance with our Privacy Policy.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">6. Limitation of Liability</h2>
        <p>
          6.1. In no event shall {BRAND_NAME}, its officers, directors,
          employees, or agents be liable for any indirect, incidental, special,
          consequential, or punitive damages, including without limitation, loss
          of profits, data, use, goodwill, or other intangible losses, resulting
          from (i) your access to or use of or inability to access or use
          Onboard Owl; (ii) any conduct or content of any third party on{" "}
          {BRAND_NAME}; (iii) any content obtained from {BRAND_NAME}; and (iv)
          unauthorized access, use, or alteration of your transmissions or
          content, whether based on warranty, contract, tort (including
          negligence), or any other legal theory, whether or not we have been
          informed of the possibility of such damage, and even if a remedy set
          forth herein is found to have failed of its essential purpose.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">7. Governing Law</h2>
        <p>
          7.1. These Terms shall be governed by and construed in accordance with
          the laws of [Your Jurisdiction], without regard to its conflict of law
          provisions.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">8. Changes to Terms</h2>
        <p>
          8.1. We reserve the right, at our sole discretion, to modify or
          replace these Terms at any time. If a revision is material, we will
          provide at least 30 days' notice prior to any new terms taking effect.
          What constitutes a material change will be determined at our sole
          discretion.
        </p>{" "}
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">9. Contact Us</h2>
        <p>
          9.1. If you have any questions about these Terms, please{" "}
          <a
            className="text-primary"
            href="https://forms.gle/T8GEujV5SGRWkqaZ6"
          >
            contact us.
          </a>
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
