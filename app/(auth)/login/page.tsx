import Image from "next/image";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login | Zylo CRM Enterprise",
  description: "Sign in to access your enterprise Zylo CRM workspace",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Left Section - Hero & Mascot Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 overflow-hidden border-r border-slate-800">
        {/* Floating Ambient Glow Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/30 p-1.5 border border-blue-400/40 shadow-lg shadow-blue-500/20 backdrop-blur-md flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Zylo CRM Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Zylo CRM
          </span>
        </div>

        {/* Mascot Centerstage */}
        <div className="relative z-10 my-auto text-center space-y-6 max-w-md mx-auto">
          <div className="relative w-64 h-64 mx-auto animate-in fade-in zoom-in-95 duration-500">
            <Image
              src="/images/mascot.png"
              alt="Zylo Assistant Mascot"
              fill
              priority
              className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Enterprise Sales & Client CRM
            </h1>
            <p className="text-sm text-blue-200/80 leading-relaxed">
              Streamline leads, client pipelines, projects, finance, HR team management, and analytics with AI precision.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 text-center">
          Zylo CRM Suite &copy; {new Date().getFullYear()} &bull; Enterprise Secure Cloud
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-slate-900/60 dark:bg-slate-950/80 relative">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}