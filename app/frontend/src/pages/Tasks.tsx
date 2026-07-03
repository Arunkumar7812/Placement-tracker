import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Trash2, Pencil, Calendar } from "lucide-react";
import { api } from "../api/client";
import type { Task } from "../types";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { Badge, Button, Card, EmptyState, Field, Input, Select, TextArea } from "../components/ui";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  due_date: "",
};

const STATUS_COLUMNS: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function loadTasks() {
    setLoading(true);
    api
      .get("/tasks")
      .then((res) => setTasks(res.data.tasks))
      .finally(() => setLoading(false));
  }

  useEffect(loadTasks, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(t: Task) {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description || "",
      priority: t.priority,
      status: t.status,
      due_date: t.due_date ? t.due_date.slice(0, 10) : "",
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, due_date: form.due_date || null };
      if (editing) {
        await api.put(`/tasks/${editing.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      setModalOpen(false);
      loadTasks();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    loadTasks();
  }

  async function quickSetStatus(t: Task, status: Task["status"]) {
    await api.put(`/tasks/${t.id}`, { status });
    loadTasks();
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Everything on your placement prep to-do list."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add task
          </Button>
        }
      />

      {!loading && tasks.length === 0 && (
        <EmptyState
          title="No tasks yet"
          subtitle="Break your prep down into concrete, trackable tasks."
          action={<Button onClick={openCreate}>Add your first task</Button>}
        />
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {STATUS_COLUMNS.map((col) => (
          <div key={col.key}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {col.label} · {tasks.filter((t) => t.status === col.key).length}
            </p>
            <div className="space-y-3">
              {tasks
                .filter((t) => t.status === col.key)
                .map((t) => (
                  <Card key={t.id}>
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{t.title}</p>
                      <Badge value={t.priority} />
                    </div>
                    {t.description && <p className="mb-2 text-xs text-ink-muted">{t.description}</p>}
                    {t.due_date && (
                      <p className="mb-2 flex items-center gap-1 text-xs text-ink-muted">
                        <Calendar size={12} /> {new Date(t.due_date).toLocaleDateString()}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <Select
                        value={t.status}
                        onChange={(e) => quickSetStatus(t, e.target.value as Task["status"])}
                        className="!w-auto !px-2 !py-1 text-xs"
                      >
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </Select>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(t)} className="text-ink-muted hover:text-yellow">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="text-ink-muted hover:text-danger">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit task" : "Add task"}>
        <form onSubmit={handleSubmit}>
          <Field label="Title">
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Description">
            <TextArea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority">
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </Select>
            </Field>
          </div>
          <Field label="Due date">
            <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </Field>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : editing ? "Save changes" : "Add task"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
