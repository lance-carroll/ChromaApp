"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { Button, Input } from "@/components/ui";

export function AppSidebar(w: ChromaWorkspace) {
  const {
    session,
    email,
    setEmail,
    authBusy,
    message,
    viewMode,
    setViewMode,
    saveBusy,
    signIn,
    signOut,
    saveSheet,
    resetDraft,
    activeSheetLabel,
    activeCampaignLabel,
    activeSceneLabel,
    activeBeatLabel,
    discordStatusLabel,
  } = w;

  return (
    <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-6">
      <div className="surface-shadow rounded-lg border border-border bg-foreground p-5 text-accent-ink">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-ink/70">
          Chroma Word Engine
        </p>
        <h1 className="mt-1 text-3xl font-black leading-tight">Play Surface</h1>
        <span className="mt-3 inline-flex items-center rounded-full border border-accent-ink/30 bg-accent-ink/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
          {session ? "Saving enabled" : "Local draft mode"}
        </span>
      </div>

      {session ? (
        <div className="surface-shadow rounded-lg border border-border bg-surface p-2">
          <nav className="grid gap-1">
            <button
              type="button"
              onClick={() => setViewMode("player")}
              className={`rounded-md px-4 py-3 text-left text-sm font-semibold transition-colors ${
                viewMode === "player"
                  ? "bg-accent/10 text-accent"
                  : "text-foreground/70 hover:bg-surface-muted"
              }`}
            >
              Player View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("gm")}
              className={`rounded-md px-4 py-3 text-left text-sm font-semibold transition-colors ${
                viewMode === "gm"
                  ? "bg-accent/10 text-accent"
                  : "text-foreground/70 hover:bg-surface-muted"
              }`}
            >
              GM View
            </button>
          </nav>
        </div>
      ) : null}

      <div className="surface-shadow rounded-lg border border-border bg-surface p-5">
        {session ? (
          <div className="grid gap-3">
            <p className="text-sm text-foreground/70">{session.user.email}</p>
            <Button variant="primary" onClick={saveSheet} disabled={saveBusy}>
              {saveBusy ? "Saving..." : "Save sheet"}
            </Button>
            <Button variant="secondary" onClick={resetDraft}>
              New draft
            </Button>
            <Button variant="ghost" onClick={signOut} disabled={authBusy}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            <h2 className="text-base font-bold">Sign In</h2>
            <p className="text-sm text-foreground/70">{message}</p>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
            <Button variant="primary" onClick={signIn} disabled={authBusy}>
              {authBusy ? "Sending..." : "Send link"}
            </Button>
          </div>
        )}
      </div>

      {session ? (
        <div className="surface-shadow grid gap-3 rounded-lg border border-border bg-surface p-5">
          <StatusRow label="Active Sheet" value={activeSheetLabel} />
          <StatusRow label="Campaign" value={activeCampaignLabel} />
          <StatusRow label="Scene / Beat" value={`${activeSceneLabel} · ${activeBeatLabel}`} />
          <StatusRow label="Discord" value={discordStatusLabel} />
        </div>
      ) : null}
    </aside>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="block text-xs font-semibold uppercase tracking-wide text-foreground/50">
        {label}
      </span>
      <span className="mt-1 block truncate text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
