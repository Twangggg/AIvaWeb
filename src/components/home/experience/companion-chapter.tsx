"use client";

import { ParentAppSection } from "@/components/home/parent-app-section";
import { ColorPickerSection } from "@/components/home/color-picker-section";

/** Paired companion beat — app mock + frame color in one narrative block. */
export function CompanionChapter() {
  return (
    <div id="companion" className="cx-companion">
      <ParentAppSection />
      <div className="cx-companion-bridge" aria-hidden />
      <ColorPickerSection />
    </div>
  );
}
