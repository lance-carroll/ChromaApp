"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { Counter, Surface, TextEntryList } from "@/components/ui";
import { colorStyles } from "@/lib/chroma";

export function CharacterVitals(w: ChromaWorkspace) {
  const {
    focus,
    setFocus,
    thread,
    setThread,
    deck,
    drawCard,
    discard,
    marks,
    setMarks,
    wounds,
    setWounds,
  } = w;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Counter label="Focus" value={focus} max={3} setValue={setFocus} tone="Gold" />
        <Counter label="Thread" value={thread} max={3} setValue={setThread} tone="Violet" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Surface>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Deck</h2>
            <button
              type="button"
              className="h-9 border border-border px-3 text-sm font-semibold hover:bg-surface-muted"
              onClick={drawCard}
            >
              Draw
            </button>
          </div>
          <p className="mt-2 font-mono text-3xl font-black">{deck.length}</p>
          <p className="mt-1 text-sm text-foreground/70">Cards remaining</p>
        </Surface>

        <Surface>
          <h2 className="text-base font-bold">Discard</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {discard.length === 0 ? (
              <p className="text-sm text-foreground/70">No cards discarded.</p>
            ) : (
              discard.map((card) => (
                <span
                  key={card.word}
                  className={`border px-2 py-1 text-sm ${colorStyles[card.color]}`}
                >
                  {card.word}
                </span>
              ))
            )}
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextEntryList
          title="Marks"
          items={marks}
          setItems={setMarks}
          placeholder="shaken, watched, off-balance"
          tone="Violet"
        />
        <TextEntryList
          title="Wounds"
          items={wounds}
          setItems={setWounds}
          placeholder="black ash, red hunger"
          tone="Red"
        />
      </div>
    </div>
  );
}
