# Zylo CRM — Deployment Guide

This document covers production deployment workflows for Zylo CRM on Vercel, Netlify, Docker, or custom Linux servers.

---

## 🚀 Recommended Deployment: Vercel

Zylo CRM is optimized for instant deployment on Vercel with zero configuration.

### Deployment Steps:
1. Push your code to GitHub / GitLab / Bitbucket.
2. Navigate to [Vercel Dashboard](https://vercel.com/new) and select **Import Project**.
3. Select the `zylo-crm` repository.
4. Configure Environment Variables under **Project Settings**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Set Build & Output Settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Click **Deploy**.

---

## 🔐 Supabase Configuration Checklist

Ensure your Supabase project settings match production requirements:

1. **Authentication Redirect URLs**:
   Add your production domain to Supabase Auth settings:
   - `https://your-domain.com/login`
   - `https://your-domain.com/forgot-password`

2. **Row Level Security (RLS)**:
   Verify RLS policies are enabled on all tables (`leads`, `clients`, `projects`, `tasks`, `invoices`, `employees`, etc.).

3. **Realtime Channels**:
   Enable Realtime on the `notifications` table for push updates.

---

## 📦 Production Build Command
To produce an optimized production bundle locally or on a CI/CD server:
```bash
npm run build
```

To start the production server:
```bash
npm run start
```
