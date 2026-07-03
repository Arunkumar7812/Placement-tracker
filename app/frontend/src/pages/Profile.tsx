import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import { Button, Card, Field, Input, TextArea } from "../components/ui";

const COLOR_OPTIONS = ["#FFC400", "#33D17A", "#5C9DFF", "#FF5C5C", "#B888FF"];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarColor, setAvatarColor] = useState(user?.avatar_color || "#FFC400");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put("/auth/me", {
        name,
        headline,
        bio,
        avatar_color: avatarColor,
      });
      updateUser(res.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage how you show up across the tracker." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full font-display text-2xl font-bold text-bg"
            style={{ backgroundColor: avatarColor }}
          >
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <p className="font-display text-base font-semibold text-ink">{name}</p>
          <p className="text-sm text-ink-muted">{user?.email}</p>
          {headline && <p className="mt-2 text-sm text-yellow">{headline}</p>}

          <div className="mt-5 flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAvatarColor(c)}
                className={`h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-surface transition ${
                  avatarColor === c ? "ring-yellow" : "ring-transparent"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Choose color ${c}`}
              />
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Headline">
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Aspiring SDE | Final year CS student"
              />
            </Field>
            <Field label="Bio">
              <TextArea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short summary about your placement goals..."
              />
            </Field>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
              {saved && <span className="text-sm text-success">Saved</span>}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
