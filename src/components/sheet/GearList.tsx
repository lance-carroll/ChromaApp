"use client";

import { useState } from "react";
import type { GearItem } from "@/lib/chroma";
import { chromaNames, colorStyles, normalizeChromaColor, normalizeCounter, parseTagList } from "@/lib/chroma";
import { Button, GaugeBar, Input, Label, Select, Surface } from "@/components/ui";

export function GearList({
  items,
  setItems,
}: {
  items: GearItem[];
  setItems: (items: GearItem[]) => void;
}) {
  const [editingIds, setEditingIds] = useState<number[]>([]);

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

  function toggleEditing(id: number) {
    setEditingIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
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
          onClick={() => {
            const newItem = {
              id: Date.now(),
              name: "",
              tags: [],
              chroma: "",
              guard: 0,
              guard_max: 0,
              supply: 0,
              supply_max: 0,
              tapped: false,
            };
            setItems([...items, newItem]);
            setEditingIds((current) => [...current, newItem.id]);
          }}
        >
          Add Gear
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const isEditing = editingIds.includes(item.id);

          if (!isEditing) {
            return (
              <div
                key={item.id}
                className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-surface-muted px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {item.name || "Unnamed gear"}
                </span>
                {item.chroma ? (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${colorStyles[item.chroma]}`}
                  >
                    {item.chroma}
                  </span>
                ) : null}
                {item.guard_max > 0 ? (
                  <div className="w-28">
                    <GaugeBar
                      label="Guard"
                      value={item.guard}
                      max={item.guard_max}
                      setValue={(value) => updateGearItem(item.id, { guard: value })}
                      tone="Blue"
                      compact
                    />
                  </div>
                ) : null}
                {item.supply_max > 0 ? (
                  <div className="w-28">
                    <GaugeBar
                      label="Supply"
                      value={item.supply}
                      max={item.supply_max}
                      setValue={(value) => updateGearItem(item.id, { supply: value })}
                      tone="Green"
                      compact
                    />
                  </div>
                ) : null}
                <Button
                  selected={item.tapped}
                  className="h-8 rounded-full px-3 text-xs"
                  onClick={() => updateGearItem(item.id, { tapped: !item.tapped })}
                >
                  {item.tapped ? "Tapped" : "Ready"}
                </Button>
                <Button
                  variant="secondary"
                  className="h-8 px-3 text-xs"
                  onClick={() => toggleEditing(item.id)}
                >
                  Edit
                </Button>
              </div>
            );
          }

          return (
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
                  className="h-10 px-3 text-sm"
                  onClick={() => toggleEditing(item.id)}
                >
                  Done
                </Button>
                <Button
                  variant="secondary"
                  className="w-10 px-0"
                  aria-label="Remove gear entry"
                  onClick={() => {
                    setItems(items.filter((entry) => entry.id !== item.id));
                    setEditingIds((current) => current.filter((entry) => entry !== item.id));
                  }}
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

              <div className="grid gap-3 md:grid-cols-[1fr_120px_120px_auto]">
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
                  <Label>Status</Label>
                  <Button
                    selected={item.tapped}
                    className="rounded-full"
                    onClick={() => updateGearItem(item.id, { tapped: !item.tapped })}
                  >
                    {item.tapped ? "Tapped" : "Ready"}
                  </Button>
                </label>
              </div>

              {item.guard_max > 0 || item.supply_max > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {item.guard_max > 0 ? (
                    <GaugeBar
                      label="Guard"
                      value={item.guard}
                      max={item.guard_max}
                      setValue={(value) => updateGearItem(item.id, { guard: value })}
                      tone="Blue"
                    />
                  ) : null}
                  {item.supply_max > 0 ? (
                    <GaugeBar
                      label="Supply"
                      value={item.supply}
                      max={item.supply_max}
                      setValue={(value) => updateGearItem(item.id, { supply: value })}
                      tone="Green"
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
