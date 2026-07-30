import { LeadList } from "@/features/crm/components/lead-list";

export const metadata = {
  title: "Leads & Pipeline | Zylo CRM",
  description: "Manage leads, sales pipeline, priority, and follow-ups",
};

export default function CrmPage() {
  return <LeadList />;
}
