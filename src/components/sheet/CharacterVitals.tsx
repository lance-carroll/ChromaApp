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
    hand,
    discardCard,
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

      <Surface as="section">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold">Hand</h2>
          <span className="text-sm text-foreground/70">{hand.length}/4</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hand.length === 0 ? (
            <p className="text-sm text-foreground/70">No cards in hand.</p>
          ) : (
            hand.map((card) => (
              <button
                type="button"
                key={card.word}
                className={`flex items-center gap-2 border px-3 py-2 text-left font-semibold hover:brightness-95 ${colorStyles[card.color]}`}
                onClick={() => discardCard(card.word)}
              >
                <span>{card.word}</span>
                <span className="text-xs uppercase">{card.color}</span>
              </button>
            ))
          )}
        </div>
      </Surface>

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
