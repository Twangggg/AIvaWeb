"use client";

import dynamic from "next/dynamic";

const PreorderForm = dynamic(
  () => import("@/features/preorder/components/preorder-form").then((module) => module.PreorderForm),
  { ssr: false }
);

export function PreorderFormNoSSR() {
  return <PreorderForm />;
}
