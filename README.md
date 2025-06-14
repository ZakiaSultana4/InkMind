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
| Database       | MongoDB or PostgreSQL    |
| Authentication | NextAuth / Clerk / Kinde |
| AI Integration | Gemini API (or similar)  |
| Deployment     | Vercel                   |

---

## 🧑‍💻 Getting Started

To get a local copy up and running, follow these simple steps:

```bash
# Clone the repository
git clone https://github.com/your-username/inkmind.git
cd inkmind
