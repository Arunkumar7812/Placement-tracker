import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Trash2, Pencil, Minus } from "lucide-react";
import { api } from "../api/client";
import type { WeeklyGoal } from "../types";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { Button, Card, EmptyState, Field, Input } from "../components/ui";

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

const emptyForm = { title: "", week_start: getWeekStart(), target_value: 5, current_value: 0, unit: "tasks" };

export default function WeeklyGoals() {
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WeeklyGoal | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function loadGoals() {
    setLoading(true);
    api
      .get("/goals")
      .then((res) => setGoals(res.data.goals))
      .finally(() => setLoading(false));
  }

  useEffect(loadGoals, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(g: WeeklyGoal) {
    setEditing(g);
    setForm({
      title: g.title,
      week_start: g.week_start.slice(0, 10),
      target_value: g.target_value,
      current_value: g.current_value,
      unit: g.unit,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/goals/${editing.id}`, form);
      } else {
        await api.post("/goals", form);
      }
      setModalOpen(false);
      loadGoals();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this goal?")) return;
    await api.delete(`/goals/${id}`);
    loadGoals();
  }

  async function adjust(g: WeeklyGoal, delta: number) {
    const next = Math.max(0, g.current_value + delta);
    await api.put(`/goals/${g.id}`, { current_value: next });
    loadGoals();
  }

  return (
    <div>
      <PageHeader
        title="Weekly Goals"
        subtitle="Set a target for the week and log your progress."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add goal
          </Button>
        }
      />

      {!loading && goals.length === 0 && (
        <EmptyState
          title="No goals set"
          subtitle="e.g. 'Solve 20 DSA problems' or 'Study for 10 hours'."
          action={<Button onClick={openCreate}>Set your first goal</Button>}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.current_value / Math.max(1, g.target_value)) * 100));
          const complete = g.current_value >= g.target_value;
          return (
            <Card key={g.id}>
              <div className="mb-1 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-medium text-ink">{g.title}</h3>
                  <p className="text-xs text-ink-muted">
                    Week of {new Date(g.week_start).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(g)} className="text-ink-muted hover:text-yellow">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(g.id)} className="text-ink-muted hover:text-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="my-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full transition-all ${complete ? "bg-success" : "bg-yellow"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-muted">
                  <span className="font-display text-sm font-semibold text-ink">{g.current_value}</span> /{" "}
                  {g.target_value} {g.unit} · {pct}%
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjust(g, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-ink-muted hover:text-ink"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => adjust(g, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-yellow/40 bg-yellow-soft text-yellow hover:bg-yellow/20"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit goal" : "Add goal"}>
        <form onSubmit={handleSubmit}>
          <Field label="Goal title">
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Solve 20 DSA problems"
            />
          </Field>
          <Field label="Week starting">
            <Input
              type="date"
              value={form.week_start}
              onChange={(e) => setForm({ ...form, week_start: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target">
              <Input
                type="number"
                min={1}
                value={form.target_value}
                onChange={(e) => setForm({ ...form, target_value: Number(e.target.value) })}
              />
            </Field>
            <Field label="Unit">
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="problems, hours..."
              />
            </Field>
          </div>
          <Field label="Current progress">
            <Input
              type="number"
              min={0}
              value={form.current_value}
              onChange={(e) => setForm({ ...form, current_value: Number(e.target.value) })}
            />
          </Field>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : editing ? "Save changes" : "Add goal"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
