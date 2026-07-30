# Zylo CRM — Installation & Setup Guide

This guide provides step-by-step instructions for installing and running Zylo CRM in local, staging, and production environments.

---

## 📋 System Requirements

| Requirement | Recommended Version |
| :--- | :--- |
| **Node.js** | `>= 18.17.0` |
| **npm** | `>= 9.0.0` |
| **OS** | Windows 10/11, macOS, or Linux |
| **Database** | PostgreSQL via Supabase |

---

## 🛠️ Step-by-Step Installation

### 1. Repository Setup
Clone the codebase to your local environment:
```bash
git clone https://github.com/your-org/zylo-crm.git
cd zylo-crm
```

### 2. Dependency Installation
Install all NPM packages:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file at the root of the project:
```bash
cp .env.example .env.local
```

Add your valid Supabase project parameters:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 4. Running the Application locally
Start the Turbopack development server:
```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:3000
```

### 5. Verification Commands
Run the TypeScript type check and production build:
```bash
# Type check
npx tsc --noEmit

# Production build
npm run build
```
