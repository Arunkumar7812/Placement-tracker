import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Trash2, Pencil, Link as LinkIcon } from "lucide-react";
import { api } from "../api/client";
import type { Resource } from "../types";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { Badge, Button, Card, EmptyState, Field, Input, Select, TextArea } from "../components/ui";

const emptyForm = { title: "", category: "DSA", url: "", notes: "", status: "to_study" };
const CATEGORIES = ["DSA", "Aptitude", "System Design", "HR", "Web Dev", "Database", "General"];

export default function PlacementPrep() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  function loadResources() {
    setLoading(true);
    api
      .get("/resources")
      .then((res) => setResources(res.data.resources))
      .finally(() => setLoading(false));
  }

  useEffect(loadResources, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(r: Resource) {
    setEditing(r);
    setForm({ title: r.title, category: r.category, url: r.url || "", notes: r.notes || "", status: r.status });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/resources/${editing.id}`, form);
      } else {
        await api.post("/resources", form);
      }
      setModalOpen(false);
      loadResources();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this resource?")) return;
    await api.delete(`/resources/${id}`);
    loadResources();
  }

  async function quickSetStatus(r: Resource, status: Resource["status"]) {
    await api.put(`/resources/${r.id}`, { status });
    loadResources();
  }

  const filtered = filter === "all" ? resources : resources.filter((r) => r.status === filter);

  return (
    <div>
      <PageHeader
        title="Placement Prep"
        subtitle="Curate and track the resources you're studying from."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add resource
          </Button>
        }
      />

      <div className="mb-5 flex gap-2">
        {["all", "to_study", "studying", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "border-yellow bg-yellow-soft text-yellow"
                : "border-border text-ink-muted hover:text-ink"
            }`}
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <EmptyState
          title="No resources here"
          subtitle="Add articles, courses, or sheets you're using to prepare."
          action={<Button onClick={openCreate}>Add a resource</Button>}
        />
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((r) => (
          <Card key={r.id}>
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-ink">{r.title}</h3>
              <Badge value={r.status} />
            </div>
            <p className="mb-2 text-xs text-ink-muted">{r.category}</p>
            {r.notes && <p className="mb-2 text-sm text-ink-muted">{r.notes}</p>}
            {r.url && (
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="mb-3 inline-flex items-center gap-1 text-xs text-yellow hover:underline"
              >
                <LinkIcon size={12} /> Open resource
              </a>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <Select
                value={r.status}
                onChange={(e) => quickSetStatus(r, e.target.value as Resource["status"])}
                className="!w-auto !px-2 !py-1 text-xs"
              >
                <option value="to_study">To study</option>
                <option value="studying">Studying</option>
                <option value="completed">Completed</option>
              </Select>
              <div className="flex gap-2">
                <button onClick={() => openEdit(r)} className="text-ink-muted hover:text-yellow">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(r.id)} className="text-ink-muted hover:text-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit resource" : "Add resource"}>
        <form onSubmit={handleSubmit}>
          <Field label="Title">
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Striver's SDE Sheet" />
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
          <Field label="URL">
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Notes">
            <TextArea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="to_study">To study</option>
              <option value="studying">Studying</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : editing ? "Save changes" : "Add resource"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
