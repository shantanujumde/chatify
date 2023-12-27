# Chatify App

## Getting Started

- To use this app, you will need:

* Node.js installed
* A database like PostgreSQL
* An account with Vercel or other hosting platform to deploy

## Installation

- Clone the repo: `git clone <repo>`
- Install dependencies: `npm install`
- Configure environment variables:

* Copy `.env.example` to `.env`
* Add your database connection URL, keys etc

- Migrate database: `npx prisma migrate dev`
- Run locally: npm run dev
- Open http://localhost:3000 to view the app

## Usage

- The main features are:

* User authentication via NextAuth
* CRUD operations on data via tRPC API routes
* Tailwind CSS for styling
* Some key things you can do:

* Register a new user
* Log in/out
* View, add, edit, delete records like posts, comments etc
* Secure routes and API endpoints
* The code is documented to understand the implementation.

## Deployment

- To deploy this Next.js app, you can use Vercel or any other platform that supports it.

* Create an account on Vercel
* Connect your Git repository
* It will automatically detect the framework and configure deployment
* Make sure environment variables are set
* Trigger deploy and your app will be live!
* And that's it! The T3 stack makes it easy to build and deploy fullstack apps. Let me know if you have any other questions!
*
