import type { Entry } from "@/lib/chroma";
import { Surface } from "./Surface";
import { Button } from "./Button";
import { Input } from "./Field";

export function TextEntryList({
  title,
  items,
  setItems,
  placeholder,
}: {
  title: string;
  items: Entry[];
  setItems: (items: Entry[]) => void;
  placeholder: string;
}) {
  return (
    <Surface as="section">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">{title}</h2>
        <Button onClick={() => setItems([...items, { id: Date.now(), value: "" }])}>
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <Input
              className="min-w-0 flex-1"
              placeholder={placeholder}
              value={item.value}
              onChange={(event) =>
                setItems(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, value: event.target.value } : entry,
                  ),
                )
              }
            />
            <Button
              variant="secondary"
              className="w-10 px-0"
              aria-label={`Remove ${title} entry`}
              onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
            >
              x
            </Button>
          </div>
        ))}
      </div>
    </Surface>
  );
}
