import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AIVA",
  description:
    "AIVA Privacy Policy by OPTIC ELITE — how we collect, use, store, and protect your data for the AIVA app and website aiva.id.vn.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}