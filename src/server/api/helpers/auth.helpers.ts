export function html(params: { url: string }) {
  const { url } = params;

  return `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Chatify!</title>
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
        <h1>Welcome to Chatify!</h1>
      </div>
      <p>Dear [User's Name],</p>
      <p>Welcome to Chatify! We're thrilled to have you on board and excited for the journey ahead. You've taken the first step toward effortless information retrieval, and we're here to guide you through it.</p>
      <p>Your Account Details:</p>
    
      <p>To get started:</p>
      <ol>
        <li><strong>Login to Chatify:</strong> Click on the button to login <a href="${url}" class="button">Login Now</a>.</li>
        <li><strong>Explore Chatify:</strong> Add documents or type in information manually, and start chatting with Chatify to retrieve the data you need effortlessly.</li>
        <li><strong>Need Help?</strong> Don't hesitate to reach out to our support team at [Support Email] if you have any questions or need assistance.</li>
      </ol>
      <p>Remember, at Chatify, we're committed to simplifying information access for you. Your satisfaction is our priority.</p>
      <p>Once again, welcome aboard, and thank you for choosing Chatify!</p>
      <div class="footer">
        <p>Best regards,<br>Shantanu Jumde<br>CEO<br>Chatify Team</p>
      </div>
    </div>
  </body>
  </html>

  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n ❤️ Chatify`;
}
