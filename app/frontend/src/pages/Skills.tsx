import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { api } from "../api/client";
import type { Skill } from "../types";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import SkillRadarChart from "../components/SkillRadarChart";
import { Button, Card, EmptyState, Field, Input, Select } from "../components/ui";

const emptyForm = { name: "", category: "General", level: 50 };
const CATEGORIES = ["DSA", "Frontend", "Backend", "Database", "System Design", "Aptitude", "General"];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function loadSkills() {
    setLoading(true);
    api
      .get("/skills")
      .then((res) => setSkills(res.data.skills))
      .finally(() => setLoading(false));
  }

  useEffect(loadSkills, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(s: Skill) {
    setEditing(s);
    setForm({ name: s.name, category: s.category, level: s.level });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/skills/${editing.id}`, form);
      } else {
        await api.post("/skills", form);
      }
      setModalOpen(false);
      loadSkills();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this skill?")) return;
    await api.delete(`/skills/${id}`);
    loadSkills();
  }

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle="Rate yourself honestly — this radar updates live."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add skill
          </Button>
        }
      />

      <Card className="mb-6">
        {loading ? (
          <div className="flex h-72 items-center justify-center text-sm text-ink-muted">Loading...</div>
        ) : (
          <SkillRadarChart skills={skills} />
        )}
      </Card>

      {!loading && skills.length === 0 && (
        <EmptyState
          title="No skills tracked yet"
          subtitle="Add skills like DSA, React, or System Design and rate your level."
          action={<Button onClick={openCreate}>Add your first skill</Button>}
        />
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {skills.map((s) => (
          <Card key={s.id}>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">{s.name}</p>
                <p className="text-xs text-ink-muted">{s.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-semibold text-yellow">{s.level}%</span>
                <button onClick={() => openEdit(s)} className="text-ink-muted hover:text-yellow">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(s.id)} className="text-ink-muted hover:text-danger">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-yellow" style={{ width: `${s.level}%` }} />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit skill" : "Add skill"}>
        <form onSubmit={handleSubmit}>
          <Field label="Skill name">
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Data Structures" />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={`Level: ${form.level}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
              className="w-full accent-yellow"
            />
          </Field>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : editing ? "Save changes" : "Add skill"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
