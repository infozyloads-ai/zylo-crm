import { HrManager } from "@/features/hr/components/hr-manager";

export const metadata = {
  title: "HR & Team Management | Zylo CRM",
  description: "Manage company employees, departments, daily shift attendance, leave requests, and payrolls",
};

export default function HrPage() {
  return <HrManager />;
}
