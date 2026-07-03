import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Trash2, Pencil, ExternalLink, GitFork as GithubIcon } from "lucide-react";
import { api } from "../api/client";
import type { Project } from "../types";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { Badge, Button, Card, EmptyState, Field, Input, Select, TextArea } from "../components/ui";

const emptyForm = {
  title: "",
  description: "",
  tech_stack: "",
  repo_url: "",
  live_url: "",
  status: "in_progress",
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function loadProjects() {
    setLoading(true);
    api
      .get("/projects")
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }

  useEffect(loadProjects, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description || "",
      tech_stack: p.tech_stack || "",
      repo_url: p.repo_url || "",
      live_url: p.live_url || "",
      status: p.status,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/projects/${editing.id}`, form);
      } else {
        await api.post("/projects", form);
      }
      setModalOpen(false);
      loadProjects();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    loadProjects();
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Track what you've built and its status."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add project
          </Button>
        }
      />

      {!loading && projects.length === 0 && (
        <EmptyState
          title="No projects yet"
          subtitle="Add the projects you're building or have shipped."
          action={<Button onClick={openCreate}>Add your first project</Button>}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-ink">{p.title}</h3>
              <Badge value={p.status} />
            </div>
            {p.description && <p className="mb-3 text-sm text-ink-muted">{p.description}</p>}
            {p.tech_stack && (
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-yellow">{p.tech_stack}</p>
            )}
            <div className="mt-auto flex items-center justify-between pt-2">
              <div className="flex gap-3">
                {p.repo_url && (
                  <a href={p.repo_url} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-yellow">
                    <GithubIcon size={16} />
                  </a>
                )}
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-yellow">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="text-ink-muted hover:text-yellow">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-ink-muted hover:text-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit project" : "Add project"}>
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
          <Field label="Tech stack">
            <Input
              placeholder="React, Node.js, PostgreSQL"
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Repo URL">
              <Input value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} />
            </Field>
            <Field label="Live URL">
              <Input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            </Field>
          </div>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="planned">Planned</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : editing ? "Save changes" : "Add project"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
