# 🧠 InkMind – AI-Powered Blog Platform

Welcome to **InkMind**, your intelligent blog assistant platform! Built with **Next.js**, **RTK Query**, and **AI integration**, InkMind helps users create, summarize, tag, and manage blog posts effortlessly. This platform is ideal for developers, writers, and content creators looking to boost productivity with AI tools.

> **Live Site:** [inkmind-one.vercel.app](https://inkmind-one.vercel.app)

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Screenshots](#screenshots)
- [Optional Stretch Goals](#optional-stretch-goals)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

- 📝 **Create, Edit, and Delete Blogs** – Full CRUD operations.
- 🔐 **Authentication** – Sign up, log in, and log out (via [NextAuth](https://next-auth.js.org/) or similar).
- 🤖 **AI Integration (Gemini API)**:
  - Generate summaries
  - Auto-suggest tags
  - Assist in writing blogs
- 🔍 **Search Functionality** – Find blogs by title or tags.
- 💬 **Commenting System** – Engage with blog posts.
- ❤️ **Like Posts** – Show appreciation for great content.
- 🙋‍♂️ **User Profiles** – Each user has a profile with bio and list of authored posts.
- ⚡ **RTK Query** – Handles API requests and caching efficiently.

---

## 🛠 Tech Stack

| Category       | Tech                     |
|----------------|--------------------------|
| Frontend       | Next.js, React           |
| State Mgmt     | Redux Toolkit + RTK Query|
| Backend        | Next.js API Routes       |
| Database       | MongoDB                  |
| Authentication | NextAuth                 |
| AI Integration | OpenAI via OpenRouter    |
| Deployment     | Vercel                   |

---

## 📄 API Routes

All backend endpoints are powered by **Next.js API Routes** and consumed via **RTK Query**.

| Endpoint            | Method         | Description               |
| ------------------- | -------------- | ------------------------- |
| `/api/auth/*`       | GET/POST       | Authentication handlers   |
| `/api/posts`        | GET/POST       | Create or list blog posts |
| `/api/posts/[id]`   | GET/PUT/DELETE | View, update, delete      |
| `/api/comments`     | POST           | Add comment to a post     |
| `/api/ai/summarize` | POST           | Generate summary via AI   |
| `/api/ai/tags`      | POST           | Auto-suggest tags         |


## 🧪 Usage

Here's how users can interact with the platform:

- ✍️ **Write Blog** – Create blog content using the built-in editor with AI-powered suggestions for text and tags via OpenRouter.
- 📂 **My Blogs** – View a list of all blog posts authored by the currently logged-in user.
- 🤖 **AI Features** – Automatically generate summaries and suggested tags for your blog post content using OpenRouter integration.
- 🔎 **Search** – Quickly find blog posts by typing keywords in the title or tags.
- 🙍‍♂️ **User Profiles** – View user bios and browse their published blog posts.


## 🧑‍💻 Getting Started

To get a local copy up and running, follow these simple steps:

```bash
# Clone the repository
git clone https://github.com/your-username/inkmind.git
cd inkmind
```
## 🧩 Installation

### Install dependencies:

```bash
npm install
# or
yarn install
```
### Create a `.env` file in the root directory and add the following environment variables:

```bash
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
MONGODB_URI=
OPENROUTER_API_KEY=

```
### Then, start the development server:

```bash
npm run dev
# or
yarn dev
```

## The app will be running at http://localhost:3000



