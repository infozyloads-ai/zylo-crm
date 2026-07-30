import { ClientList } from "@/features/clients/components/client-list";

export const metadata = {
  title: "Clients Management | Zylo CRM",
  description: "Manage client profiles, accounts, contact info, and activity history",
};

export default function ClientsPage() {
  return <ClientList />;
}
