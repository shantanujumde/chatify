import Image from "next/image";
import { type FC } from "react";

// interface DocsProps {}

const Docs: FC = ({}) => {
  return (
    <div className="flex flex-col gap-80">
      <h1 className="text-4xl font-bold">How to Use Chatify App</h1>

      <div className="flex justify-center gap-8 align-middle max-md:flex-col md:flex-row">
        <div className="mt-8 flex flex-col justify-center text-xl">
          <h2 className="mb-2 text-2xl font-bold">Adding Documents</h2>
          <ol className="list-inside list-decimal">
            <li>Go to the &quot;Knowledge Base&quot; page after logging in</li>
            <li>Click the &quot;Add Document&quot; button</li>
            <li>Select a file from your computer to upload</li>
            <li>Add a title and description for the document</li>
            <li>Click &quot;Upload&quot; and the document will be processed</li>
            <li>
              Wait for the processing to complete before the document can be
              chatted with
            </li>
            <li>Repeat to add multiple documents to your knowledge base</li>
            <li>The documents can be PDFs, Word, Excel, Text files etc</li>
            <li>There is a limit of 50 documents in the free plan</li>
            <li>
              Uploaded documents are only accessible to you in your account
            </li>
          </ol>
        </div>
        <Image
          src="/chat-preview.webp"
          alt="uploading preview"
          width={800}
          height={250}
          className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
        />
      </div>

      <div className="flex justify-center gap-8 align-middle max-md:flex-col-reverse md:flex-row">
        <Image
          src="/chat-preview.webp"
          alt="uploading preview"
          width={800}
          height={250}
          className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
        />
        <div className="mt-8 flex  flex-col justify-center text-xl">
          <h2 className="mb-2 text-2xl font-bold">Chatting</h2>
          <ol className="list-inside list-decimal">
            <li>
              Go to the &quot;Chat&quot; page after documents are uploaded
            </li>
            <li>The left panel shows all your available documents</li>
            <li>Click on a document to select it for chatting</li>
            <li>Type a question in the chatbox at the bottom</li>
            <li>The app will process and return an answer from the document</li>
            <li>
              You can keep asking followup questions to have a conversation
            </li>
            <li>Use natural language as you would normally ask a question</li>
            <li>The chatbot will keep improving the more you chat with it</li>
            <li>Relevant sections from the document are shown as answers</li>
            <li>Switch documents in the left panel to chat with other docs</li>
          </ol>
        </div>
      </div>

      <div className="flex justify-center gap-8 align-middle max-md:flex-col md:flex-row">
        <div className="mt-8 flex flex-col justify-center text-xl">
          <h2 className="mb-2 text-2xl font-bold">Managing Subscription</h2>
          <ol className="list-inside list-decimal">
            <li>Go to &quot;Subscription&quot; page under your account menu</li>
            <li>This shows your current subscription plan details</li>
            <li>You can upgrade, downgrade or cancel your subscription here</li>
            <li>The free plan allows limited knowledge base size and users</li>
            <li>
              Paid plans unlock more features like integrations, priority
              support etc
            </li>
            <li>
              When upgrading, you can pick between monthly or yearly billing
            </li>
            <li>Pick a plan and complete the payment to upgrade</li>
            <li>The new plan will be active immediately after payment</li>
            <li>
              You can cancel anytime - your plan will remain active until the
              next billing date
            </li>
            <li>
              Downgrading plans also takes effect from the next billing cycle
            </li>
            <li>
              Contact us if you need to change plans immediately or need
              assistance
            </li>
          </ol>
        </div>
        <Image
          src="/chat-preview.webp"
          alt="uploading preview"
          width={800}
          height={250}
          className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
        />
      </div>

      <div className="flex justify-center gap-8 align-middle max-md:flex-col-reverse md:flex-row">
        <Image
          src="/chat-preview.webp"
          alt="uploading preview"
          width={800}
          height={250}
          className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
        />
        <div className="mt-8 flex flex-col justify-center text-xl">
          <h2 className="mb-2 text-2xl font-bold">Inviting Users</h2>
          <ol className="list-inside list-decimal">
            <li> Go to &quot;Team&quot; page from your account menu</li>
            <li>Here you can invite new users to your knowledge base</li>
            <li>
              Enter email addresses separated by commas to invite multiple users
            </li>
            <li>
              The invite email will be sent to them with sign up instructions
            </li>
            <li>
              You can see all your team members and their statuses on this page
            </li>
            <li>Revoke access for members any time by removing them</li>
            <li>Manage roles like admin, editor, viewer etc for members</li>
            <li>
              Admins can add, edit, delete documents in your knowledge base
            </li>
            <li>
              Editors can add and edit documents while viewers can only chat
            </li>
            <li>Configure permissions as needed for each team member</li>
          </ol>
        </div>
      </div>

      <div className="flex justify-center gap-8 align-middle max-md:flex-col md:flex-row">
        <div className="mt-8 flex flex-col justify-center text-xl">
          <h2 className="mb-2 text-2xl font-bold">Using Profile</h2>
          <ol className="list-inside list-decimal">
            <li> Go to your profile page by clicking your avatar</li>
            <li>You can customize your public profile seen by other users</li>
            <li>Add your name, bio, profile photo and other details here</li>
            <li>
              Your account settings like email and password can also be changed
            </li>
            <li>You can view your subscription plan details and status</li>
            <li>See your knowledge base usage and limits on this page</li>
            <li>Lists all the documents you have uploaded</li>
            <li>Monitor your chatbot&apos;s performance from the analytics</li>
            <li>Integrate with other apps you use via the connections</li>
            <li>
              Customize your experience by modifying your profile settings
            </li>
          </ol>
        </div>
        <Image
          src="/chat-preview.webp"
          alt="uploading preview"
          width={800}
          height={250}
          className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/10"
        />
      </div>
    </div>
  );
};

export default Docs;
