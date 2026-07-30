import { ProjectList } from "@/features/projects/components/project-list";

export const metadata = {
  title: "Projects Management | Zylo CRM",
  description: "Track active client projects, deliverables, milestones, budgets, and team assignments",
};

export default function ProjectsPage() {
  return <ProjectList />;
}
