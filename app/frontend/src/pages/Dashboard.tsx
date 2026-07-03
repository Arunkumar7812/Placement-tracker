import { useEffect, useState } from "react";
import { FolderKanban, ListChecks, BookOpen, Target } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Project, Skill, Task, WeeklyGoal } from "../types";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui";
import SkillRadarChart from "../components/SkillRadarChart";

export default function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/skills"),
      api.get("/tasks"),
      api.get("/projects"),
      api.get("/goals"),
    ])
      .then(([s, t, p, g]) => {
        setSkills(s.data.skills);
        setTasks(t.data.tasks);
        setProjects(p.data.projects);
        setGoals(g.data.goals);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingTasks = tasks.filter((t) => t.status !== "done").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const avgSkillLevel = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)
    : 0;
  const currentGoal = goals[0];

  const stats = [
    { label: "Active tasks", value: pendingTasks, icon: ListChecks },
    { label: "Projects done", value: `${completedProjects}/${projects.length}`, icon: FolderKanban },
    { label: "Avg. skill level", value: `${avgSkillLevel}%`, icon: BookOpen },
    {
      label: "This week's goal",
      value: currentGoal ? `${currentGoal.current_value}/${currentGoal.target_value}` : "—",
      icon: Target,
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="Here's where your placement prep stands today."
      />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <Icon className="mb-3 text-yellow" size={20} />
            <p className="font-display text-2xl font-semibold text-ink">{value}</p>
            <p className="mt-1 text-xs text-ink-muted">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Skill radar</h2>
          {loading ? (
            <div className="flex h-72 items-center justify-center text-sm text-ink-muted">Loading...</div>
          ) : (
            <SkillRadarChart skills={skills} />
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Upcoming tasks</h2>
          {tasks.filter((t) => t.status !== "done").length === 0 ? (
            <p className="text-sm text-ink-muted">Nothing pending — you're all caught up.</p>
          ) : (
            <ul className="space-y-3">
              {tasks
                .filter((t) => t.status !== "done")
                .slice(0, 6)
                .map((t) => (
                  <li key={t.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                      {t.due_date && (
                        <p className="text-xs text-ink-muted">
                          Due {new Date(t.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.priority === "high"
                          ? "bg-danger/10 text-danger"
                          : t.priority === "medium"
                          ? "bg-yellow-soft text-yellow"
                          : "bg-surface-2 text-ink-muted"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
