import { TaskManager } from "@/features/tasks/components/task-manager";

export const metadata = {
  title: "Tasks Management | Zylo CRM",
  description: "Organize workspace tasks, sprint deliverables, checklists, and team deadlines",
};

export default function TasksPage() {
  return <TaskManager />;
}
