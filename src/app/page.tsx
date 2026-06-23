"use client";

import { useChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { GMPanel } from "@/components/campaign/GMPanel";
import { PostBuilderPanel } from "@/components/player/PostBuilderPanel";
import { WorkspacePanel } from "@/components/workspace/WorkspacePanel";
import { CharacterSheetPanel } from "@/components/sheet/CharacterSheetPanel";
import { CharacterVitals } from "@/components/sheet/CharacterVitals";

export default function Home() {
  const workspace = useChromaWorkspace();
  const { session, viewMode } = workspace;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <AppSidebar {...workspace} />

        <div className="flex flex-col gap-6">
          {session ? (
            <>
              {viewMode === "gm" ? (
                <GMPanel {...workspace} />
              ) : (
                <>
                  <CharacterVitals {...workspace} />
                  <PostBuilderPanel {...workspace} />
                </>
              )}
              <WorkspacePanel {...workspace} />
              <CharacterSheetPanel {...workspace} />
            </>
          ) : (
            <div className="surface-shadow rounded-lg border border-border bg-surface p-6 text-sm text-foreground/70">
              Sign in from the sidebar to load or create a character sheet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
