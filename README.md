# 🌐 True Feedback - Anonymous Feedback Platform

A modern full-stack web app built with **Next.js**, providing a secure, verified, and anonymous platform for users to send and receive feedback.

![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)
![Zod](https://img.shields.io/badge/Validation-Zod-purple?logo=zod)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-success)

---

## 📑 Table of Contents

- [🚀 Project Overview](#-project-overview)
- [⚙️ Tech Stack](#️-tech-stack)
- [📦 Features](#-features)
- [🔐 Environment Variables](#-environment-variables)
- [🛠️ Getting Started](#️-getting-started)
- [📁 Project Structure](#-project-structure)
- [🌍 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [📚 Resources](#-resources)
- [📝 License](#-license)
- [🤝 Contributing](#-contributing)

---

## 🚀 Project Overview

**True Feedback** is a platform that lets users create accounts with email verification and receive anonymous feedback from others via a unique link. It is secure, responsive, and built with modern tools.

---

## ⚙️ Tech Stack

| Tech             | Purpose                            |
|------------------|-------------------------------------|
| **Next.js**      | React Framework + SSR/SSG Support   |
| **TypeScript**   | Type-safe JavaScript                |
| **MongoDB**      | NoSQL Database                      |
| **Mongoose**     | MongoDB ODM                         |
| **Tailwind CSS** | Utility-first CSS                   |
| **NextAuth.js**  | Authentication                      |
| **Zod**          | Schema validation                   |
| **Resend**       | Email delivery for verification     |
| **Shadcn/UI**    | UI components                       |
| **React Hook Form** | Form state management            |
| **Axios**        | HTTP client for API requests        |

---

## 📦 Features

- ✅ Sign up with email and username
- 🔐 Email verification with **Resend**
- ✅ Secure login using NextAuth
- 🧾 Dashboard to manage received feedback
- ✉️ Anonymous feedback submission
- 🎨 Beautiful UI with **TailwindCSS** and **shadcn/ui**
- ✅ Schema validation with **Zod**
- 🛡️ Protected API routes
- 📦 Modular folder structure

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# MongoDB
MONGODB_URI=your_mongodb_uri

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_email@example.com
