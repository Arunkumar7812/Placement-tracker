import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Skill } from "../types";

export default function SkillRadarChart({ skills }: { skills: Skill[] }) {
  const data = skills.map((s) => ({ subject: s.name, level: s.level }));

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border text-center text-sm text-ink-muted">
        Add a skill to see your progress here
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2f" vertical={false} />
        <XAxis
          dataKey="subject"
          tick={{ fill: "#a3a3a0", fontSize: 12 }}
          axisLine={{ stroke: "#2b2b2f" }}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#5c5c58", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="level" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill="#ffc400" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}