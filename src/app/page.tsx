"use client";

import { useChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { AppHeader } from "@/components/layout/AppHeader";
import { GMPanel } from "@/components/campaign/GMPanel";
import { PostBuilderPanel } from "@/components/player/PostBuilderPanel";
import { WorkspacePanel } from "@/components/workspace/WorkspacePanel";
import { CharacterSheetPanel } from "@/components/sheet/CharacterSheetPanel";

export default function Home() {
  const workspace = useChromaWorkspace();
  const { session, viewMode } = workspace;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AppHeader {...workspace} />

        {session ? (
          <>
            {viewMode === "gm" ? (
              <GMPanel {...workspace} />
            ) : (
              <PostBuilderPanel {...workspace} />
            )}
            <WorkspacePanel {...workspace} />
            <CharacterSheetPanel {...workspace} />
          </>
        ) : null}
      </div>
    </main>
  );
}
