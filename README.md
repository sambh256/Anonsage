# 💬 Mystery Message – Anonymous Feedback Platform

A full-stack web application built with **Next.js**, **TypeScript**, **MongoDB**, and **NextAuth.js**. It allows users to register, verify their account via email using **Resend**, and receive anonymous feedback from others.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Environment Variables](#3-create-a-envlocal-file)
  - [Run the App](#4-start-the-development-server)
- [Folder Structure](#-folder-structure)
- [Security](#️-security)
- [Anonymous Messaging](#-anonymous-messaging)
- [Scripts](#-scripts)
- [Upcoming Features](#-upcoming-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔧 Features

- 🔐 User Authentication (username/email + password)
- 📧 Email verification via one-time code (Resend)
- 🔁 Login with NextAuth credentials provider
- 📨 Anonymous message submission
- 🛡️ Protected dashboard with session-based auth
- 🎨 Beautiful UI with Tailwind CSS
- ✅ Form validation using Zod + React Hook Form
- 🧪 Toast notifications using Sonner

---

## 🧱 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Auth**: NextAuth.js (Credentials Provider)
- **Email**: Resend
- **Validation**: Zod
- **Form Handling**: React Hook Form
- **Notifications**: Sonner

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mystery-message.git
cd mystery-message

