"use client";

import { cn } from "@/lib/utils";
import { RELATIONSHIP_TYPE_ORDER, relationshipFramingFor, type RelationshipType } from "./relationshipFraming";

/** Romantic/Friend/Coworker pill toggle — shared by the two-person celebrity matcher and any single-pairing compatibility report (vs=me, an AI-audited person) that needs the same relationship-type switch. */
export function RelationshipTypeToggle({
  value,
  onSelect,
}: {
  value: RelationshipType;
  onSelect: (type: RelationshipType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {RELATIONSHIP_TYPE_ORDER.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            type === value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          {relationshipFramingFor(type).label}
        </button>
      ))}
    </div>
  );
}
