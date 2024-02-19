import type { User } from "@prisma/client";
import { BRAND_NAME } from "../../../utils/utils";

type EmailOptionsType = {
  url: string;
  user?: User | null;
  message?: { title?: string; body?: string };
};

export function inviteUserEmailHtml({ url, user, message }: EmailOptionsType) {
  return `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${BRAND_NAME}!</title>
    <style>
      /* Custom styles with theme colors */
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        text-decoration: none;
        background-color: #21B357;
        color: #fff;
        border-radius: 5px;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
      h1, h2 {
        color: #121212;
      }
      ul, ol, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to ${BRAND_NAME}!</h1>
      </div>
      <p>Dear ${user?.name ?? user?.email?.split("@")[0] ?? "user"},</p><br/>
      <p>Welcome to ${BRAND_NAME}! We're thrilled to have you on board and excited for the journey ahead. You've taken the first step toward effortless information retrieval, and we're here to guide you through it.</p>
      ${
        message?.title && message?.body
          ? `<h3>${message.title}: </h3><strong>${message.body}</strong>`
          : ""
      }
      
      <br/><p>Your Account Details:</p>
      <br/>
      <p>To get started:</p><br/>
      <ol>
        <li><strong>Login to ${BRAND_NAME}:</strong> Click on the button to login <br/><a href="${url}" class="button">Login Now</a>.</li>
        <li><strong>Explore ${BRAND_NAME}:</strong> Add documents or type in information manually, and start chatting with ${BRAND_NAME} to retrieve the data you need effortlessly.</li>
        <li><strong>Need Help?</strong> Don't hesitate to reach out to our support team at [Support Email] if you have any questions or need assistance.</li>
      </ol>
      <p>Remember, at ${BRAND_NAME}, we're committed to simplifying information access for you. Your satisfaction is our priority.</p>
      <p>Once again, welcome aboard, and thank you for choosing ${BRAND_NAME}!</p>
      <div class="footer">
        <p>Best regards,<br>Shantanu Jumde<br>CEO<br>${BRAND_NAME} Team</p>
      </div>
    </div>
  </body>
  </html>

  `;
}

export function signInLinkEmailHtml({ url, user, message }: EmailOptionsType) {
  return `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${BRAND_NAME}!</title>
    <style>
      /* Custom styles with theme colors */
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        text-decoration: none;
        background-color: #21B357;
        color: #fff;
        border-radius: 5px;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #888;
        text-align: center;
      }
      h1, h2 {
        color: #121212;
      }
      ul, ol, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to ${BRAND_NAME}!</h1>
      </div>
      <p>Dear ${user?.name ?? user?.email?.split("@")[0] ?? "user"},</p>
     <br/>

     ${
       message?.title && message?.body
         ? `<h3>${message.title}: </h3><strong>${message.body}</strong>`
         : ""
     }

     <p>Your Account Details:</p>
      <br/>
      <p>To Login:</p><br/>
      <ol>
        <li><strong>Login to ${BRAND_NAME}:</strong> Please use the button to login directly <br/><a href="${url}" class="button">Login Now</a>.</li>
        <li><strong>Dont&apos;s:</strong> Please do not share the contents of the mail with anyone.</li>
      </ol>
  
    </div>
  </body>
  </html>

  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n ❤️ ${BRAND_NAME}`;
}
