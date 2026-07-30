import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-10">
        <img
          src="/images/logo.png"
          alt="Zylo CRM"
          className="w-28 mb-6"
        />

        <img
          src="/images/mascot.png"
          alt="Mascot"
          className="w-72 mb-8"
        />

        <h1 className="text-4xl font-bold mb-4">
          Welcome to Zylo CRM
        </h1>

        <p className="text-center max-w-md text-blue-100">
          Manage Leads, Clients, Projects, Finance and HR
          from one powerful platform.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
