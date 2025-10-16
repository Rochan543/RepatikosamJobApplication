import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export type JobPayload = {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  applyLink: string;
};

type Props = {
  initial?: Partial<JobPayload> & { _id?: string };
  onSave: (payload: JobPayload, id?: string) => Promise<void>;
  onCancel?: () => void;
};

export default function AdminJobForm({ initial, onSave, onCancel }: Props) {
  const defaultForm: JobPayload = {
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    applyLink: "",
  };

  const [form, setForm] = useState<JobPayload>(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update form only when the selected initial job changes (by id) to avoid
    // reacting to parent re-renders that recreate object identities.
    if (initial && (initial as any)._id) {
      setForm((prev) => {
        const merged = { ...defaultForm, ...(initial as any) };
        // shallow compare common fields to avoid unnecessary updates
        if (
          prev.title === merged.title &&
          prev.company === merged.company &&
          prev.location === merged.location &&
          prev.salary === merged.salary &&
          prev.description === merged.description &&
          prev.applyLink === merged.applyLink
        ) {
          return prev;
        }
        return merged;
      });
    } else {
      setForm(defaultForm);
    }
  }, [initial ? (initial as any)._id : null]);

  function update<K extends keyof JobPayload>(key: K, value: JobPayload[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const id = (initial as any)?._id;
      await onSave(form, id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="Job title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          required
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          required
        />
        <input
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => update("salary", e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>
      <div>
        <input
          placeholder="Apply link (https://...)"
          value={form.applyLink}
          onChange={(e) => update("applyLink", e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-md border px-3 py-2 h-28"
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" variant="default" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
