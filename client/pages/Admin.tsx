import React, { useEffect, useState } from "react";
import { getToken, setToken, removeToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import AdminJobForm, { JobPayload } from "@/components/AdminJobForm";

type Job = JobPayload & { _id: string };

export default function Admin() {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  function pushDebug(msg: string) {
    setDebugLogs((s) => [msg, ...s].slice(0, 20));
    // also console
    try {
      console.debug(msg);
    } catch {}
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        pushDebug(`login failed: ${res.status} ${body}`);
        console.error("Login failed", res.status, body);
        throw new Error("Invalid credentials");
      }
      const data = await res.json();
      pushDebug(`login success: token=${String(data.token).slice(0,10)}...`);
      setToken(data.token);
      setTokenState(data.token);
      // reload jobs after login
      loadJobs();
    } catch (err: any) {
      console.error("login error", err);
      setError(err.message || "Login failed");
      pushDebug(`login error: ${String(err.message)}`);
    }
  }

  function logout() {
    removeToken();
    setTokenState(null);
  }

  async function handleSave(payload: JobPayload, id?: string) {
    setError(null);
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/jobs/${id}` : "/api/jobs";
    const t = token || getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (t) headers.Authorization = `Bearer ${t}`;
    try {
      pushDebug(`saving ${method} ${url} auth=${Boolean(t)} payload=${JSON.stringify(payload).slice(0,200)}`);
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let body: any = text;
      try {
        body = JSON.parse(text);
      } catch {}
      pushDebug(`save response ${res.status} ${JSON.stringify(body).slice(0,200)}`);
      if (!res.ok) {
        throw new Error(body?.message || "Failed to save");
      }
      await loadJobs();
      setShowAdd(false);
      setEditing(null);
    } catch (err: any) {
      console.error("save error", err);
      setError(err.message || "Failed to save");
      pushDebug(`save error ${String(err.message)}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    const t = token || getToken();
    const headers: Record<string, string> = {};
    if (t) headers.Authorization = `Bearer ${t}`;
    try {
      pushDebug(`deleting ${id} auth=${Boolean(t)}`);
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE", headers });
      const text = await res.text();
      let body: any = text;
      try { body = JSON.parse(text); } catch {}
      pushDebug(`delete response ${res.status} ${JSON.stringify(body).slice(0,200)}`);
      if (!res.ok) throw new Error(body?.message || "Failed to delete");
      await loadJobs();
    } catch (err: any) {
      console.error("delete error", err);
      setError(err.message || "Failed to delete");
      pushDebug(`delete error ${String(err.message)}`);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {token ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground/70">Signed in</span>
            <Button size="sm" variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : null}
      </div>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <div className="mb-4">
        <details className="bg-slate-50 p-3 rounded">
          <summary className="cursor-pointer text-sm text-foreground/70">Debug logs (click to expand)</summary>
          <div className="mt-2 max-h-48 overflow-auto text-xs font-mono">
            {debugLogs.length === 0 ? <div className="text-foreground/70">No logs yet.</div> : debugLogs.map((l, i) => <div key={i} className="py-1 border-b last:border-b-0">{l}</div>)}
          </div>
        </details>
      </div>

      {!token ? (
        <div className="max-w-md">
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-md border px-3 py-2" />
            </div>
            <div>
              <Button type="submit">Sign in</Button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Job Management</h2>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={() => { setShowAdd((s) => !s); setEditing(null); }}>
                {showAdd ? "Close" : "Add Job"}
              </Button>
              <Button size="sm" variant="default" onClick={loadJobs}>Refresh</Button>
            </div>
          </div>

          {showAdd && (
            <div className="mb-6">
              <AdminJobForm onSave={handleSave} onCancel={() => setShowAdd(false)} />
            </div>
          )}

          {loading ? (
            <div>Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-foreground/70">No jobs yet.</div>
          ) : (
            <div className="space-y-4">
              {jobs.map((j) => (
                <div key={j._id} className="rounded-md border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{j.title}</h3>
                    <p className="text-sm text-foreground/70">{j.company} • {j.location} {j.salary ? `• ${j.salary}` : ""}</p>
                    <p className="mt-2 text-sm text-foreground/80 line-clamp-3">{j.description}</p>
                    <a href={j.applyLink} target="_blank" rel="noreferrer" className="text-primary underline text-sm mt-2 inline-block">Open apply link</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(j); setShowAdd(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(j._id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editing && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Edit Job</h3>
              <AdminJobForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
