"use client";

import type { GearItem } from "@/lib/chroma";
import { chromaNames, normalizeChromaColor, normalizeCounter, parseTagList } from "@/lib/chroma";
import { Button, Input, Label, Select, Surface } from "@/components/ui";

export function GearList({
  items,
  setItems,
}: {
  items: GearItem[];
  setItems: (items: GearItem[]) => void;
}) {
  function updateGearItem(id: number, updates: Partial<GearItem>) {
    setItems(
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextItem = { ...item, ...updates };
        const nextGuardMax = Math.max(0, nextItem.guard_max);
        const nextSupplyMax = Math.max(0, nextItem.supply_max);

        return {
          ...nextItem,
          guard_max: nextGuardMax,
          guard: Math.min(Math.max(0, nextItem.guard), nextGuardMax || 0),
          supply_max: nextSupplyMax,
          supply: Math.min(Math.max(0, nextItem.supply), nextSupplyMax || 0),
          chroma: normalizeChromaColor(nextItem.chroma),
        };
      }),
    );
  }

  return (
    <Surface as="section">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Gear</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Structure gear into tags, Chroma, Guard, and Supply.
          </p>
        </div>
        <Button
          onClick={() =>
            setItems([
              ...items,
              {
                id: Date.now(),
                name: "",
                tags: [],
                chroma: "",
                guard: 0,
                guard_max: 0,
                supply: 0,
                supply_max: 0,
                tapped: false,
              },
            ])
          }
        >
          Add Gear
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-md border border-border bg-surface-muted p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Input
                  className="font-semibold"
                  placeholder="Pilgrim Shield"
                  value={item.name}
                  onChange={(event) => updateGearItem(item.id, { name: event.target.value })}
                />
              </div>
              <Button
                variant="secondary"
                className="w-10 px-0"
                aria-label="Remove gear entry"
                onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
              >
                x
              </Button>
            </div>

            <label className="grid gap-1">
              <Label>Tags</Label>
              <Input
                placeholder="defense, protection, oath"
                value={item.tags.join(", ")}
                onChange={(event) =>
                  updateGearItem(item.id, { tags: parseTagList(event.target.value) })
                }
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-1">
                <Label>Chroma</Label>
                <Select
                  value={item.chroma}
                  onChange={(event) => updateGearItem(item.id, { chroma: event.target.value })}
                >
                  <option value="">None</option>
                  {chromaNames.map((color) => (
                    <option key={`gear-color-${item.id}-${color}`} value={color}>
                      {color}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="grid gap-1">
                <Label>Guard Max</Label>
                <Input
                  type="number"
                  min={0}
                  value={item.guard_max}
                  onChange={(event) =>
                    updateGearItem(item.id, { guard_max: normalizeCounter(event.target.value) })
                  }
                />
              </label>

              <label className="grid gap-1">
                <Label>Guard Current</Label>
                <Input
                  type="number"
                  min={0}
                  max={item.guard_max}
                  value={item.guard}
                  onChange={(event) =>
                    updateGearItem(item.id, { guard: normalizeCounter(event.target.value) })
                  }
                />
              </label>

              <label className="grid gap-1">
                <Label>Tapped This Scene</Label>
                <Button
                  selected={item.tapped}
                  onClick={() => updateGearItem(item.id, { tapped: !item.tapped })}
                >
                  {item.tapped ? "Tapped" : "Ready"}
                </Button>
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <Label>Supply Max</Label>
                <Input
                  type="number"
                  min={0}
                  value={item.supply_max}
                  onChange={(event) =>
                    updateGearItem(item.id, { supply_max: normalizeCounter(event.target.value) })
                  }
                />
              </label>

              <label className="grid gap-1">
                <Label>Supply Current</Label>
                <Input
                  type="number"
                  min={0}
                  max={item.supply_max}
                  value={item.supply}
                  onChange={(event) =>
                    updateGearItem(item.id, { supply: normalizeCounter(event.target.value) })
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}
