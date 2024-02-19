"use client";
import Image from "next/image";
import { type FC } from "react";
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
import { BRAND_NAME } from "../../utils/utils";

// interface DocsProps {}

const Docs: FC = ({}) => {
  const ZoomInScrollOut = batch(Sticky(), FadeIn(), ZoomIn(), MoveOut(0, -200));

  return (
    <div className="flex flex-col gap-80">
      <ScrollContainer snap="proximity">
        <ScrollPage>
          <Animator
            className="flex w-[90vw] flex-col gap-4"
            animation={batch(Sticky(), Fade(), MoveOut(0, -200))}
          >
            <div>
              <h1 className="my-32 text-center text-6xl font-bold">
                How to Use {BRAND_NAME} App
              </h1>

              <div className="flex justify-center gap-8 align-middle max-md:flex-col md:flex-row">
                <div className="mt-8 flex flex-col justify-center text-xl">
                  <h2 className="mb-2 text-2xl font-bold">Adding Documents</h2>
                  <ol className="list-inside list-decimal">
                    <li>
                      Go to the &quot;Knowledge Base&quot; page after logging
                      in.
                    </li>
                    <li>Click the &quot;Add Document&quot; button.</li>
                    <li>Select a file from your computer to upload.</li>
                    <li>Add a title and description for the document.</li>
                    <li>
                      Click &quot;Upload&quot; and the document will be
                      processed.
                    </li>
                    <li>
                      Wait for the processing to complete before the document
                      can be chatted with.
                    </li>
                    <li>
                      Repeat to add multiple documents to your knowledge base.
                    </li>
                    <li>
                      The documents can be PDFs, Word, Excel, Text files etc.
                    </li>
                  </ol>
                </div>
                <Image
                  src="/addDocuments.webp"
                  alt="uploading preview"
                  width={800}
                  height={250}
                  className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex w-[90vw] flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <div className="flex justify-center gap-8 align-middle max-md:flex-col-reverse md:flex-row">
              <Image
                src="/chat.webp"
                alt="uploading preview"
                width={800}
                height={250}
                className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
              />
              <div className="mt-8 flex  flex-col justify-center text-xl">
                <h2 className="mb-2 text-2xl font-bold">Chatting</h2>
                <ol className="list-inside list-decimal">
                  <li>
                    Go to &quot;Chatify&quot; page after documents are uploaded.
                  </li>
                  <li>The left panel shows all your available documents.</li>
                  <li>Type a question in the chatbox at the bottom.</li>
                  <li>
                    The app will process and return an answer from the document.
                  </li>
                  <li>
                    You can keep asking followup questions to have a
                    conversation.
                  </li>
                  <li>
                    Use natural language as you would normally ask a question.
                  </li>
                  <li>
                    The chatbot will keep improving the more you chat with it.
                  </li>
                  <li>
                    Relevant sections from the document are shown as answers.
                  </li>
                </ol>
              </div>
            </div>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex w-[90vw] flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <div className="flex justify-center gap-8 align-middle max-md:flex-col md:flex-row">
              <div className="mt-8 flex flex-col justify-center text-xl">
                <h2 className="mb-2 text-2xl font-bold">
                  Managing Subscription
                </h2>
                <ol className="list-inside list-decimal">
                  <li>
                    Go to &quot;Subscription&quot; page under your account menu.
                  </li>
                  <li>This shows your current subscription plan details.</li>
                  <li>
                    You can upgrade, downgrade or cancel your subscription here.
                  </li>
                  <li>
                    Paid plans unlock more features like integrations, priority
                    support etc.
                  </li>
                  <li>
                    When upgrading, you can pick between monthly or yearly
                    billing.
                  </li>
                  <li>Pick a plan and complete the payment to upgrade.</li>
                  <li>
                    The new plan will be active immediately after payment.
                  </li>
                  <li>
                    You can cancel anytime - your plan will remain active until
                    the next billing date.
                  </li>
                  <li>
                    Downgrading plans also takes effect from the next billing
                    cycle.
                  </li>
                  <li>
                    Contact us if you need to change plans immediately or need
                    assistance.
                  </li>
                </ol>
              </div>
              <Image
                src="/manageSubscriptions.webp"
                alt="uploading preview"
                width={800}
                height={250}
                className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex w-[90vw] flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <div className="flex justify-center gap-8 align-middle max-md:flex-col-reverse md:flex-row">
              <Image
                src="/inviteUsers.webp"
                alt="uploading preview"
                width={800}
                height={250}
                className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
              />
              <div className="mt-8 flex flex-col justify-center text-xl">
                <h2 className="mb-2 text-2xl font-bold">Inviting Users</h2>
                <ol className="list-inside list-decimal">
                  <li> Go to &quot;Team&quot; page from your account menu.</li>
                  <li>Here you can invite new users to your knowledge base.</li>
                  <li>
                    Enter email addresses separated by commas to invite multiple
                    users.
                  </li>
                  <li>
                    The invite email will be sent to them with sign up
                    instructions.
                  </li>
                  <li>Revoke access for members any time by removing them.</li>
                  <li>
                    Manage roles like admin, editor, viewer etc for members.
                  </li>
                  <li>
                    Admins can add, edit, delete documents in your knowledge
                    base.
                  </li>
                  <li>Configure permissions as needed for each team member.</li>
                </ol>
              </div>
            </div>
          </Animator>
        </ScrollPage>

        <ScrollPage>
          <Animator
            className="flex w-[90vw] flex-col gap-4"
            animation={batch(ZoomInScrollOut)}
          >
            <div className="flex justify-center gap-8 align-middle max-md:flex-col md:flex-row">
              <div className="mt-8 flex flex-col justify-center text-xl">
                <h2 className="mb-2 text-2xl font-bold">Using Profile</h2>
                <ol className="list-inside list-decimal">
                  <li>Go to your profile page by clicking your avatar.</li>
                  <li>You can customize your profile.</li>
                  <li>Add your name, profile photo and other details here.</li>
                  <li>
                    You can view your subscription plan details and status.
                  </li>
                  <li>
                    See your knowledge base usage and limits on this page.
                  </li>
                  <li>Number of all the documents you have uploaded.</li>
                  <li>
                    Customize your experience by modifying your profile
                    settings.
                  </li>
                </ol>
              </div>
              <Image
                src="/profileSection.webp"
                alt="uploading preview"
                width={800}
                height={250}
                className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </Animator>
        </ScrollPage>
      </ScrollContainer>
    </div>
  );
};

export default Docs;
