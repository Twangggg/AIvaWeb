"use client";

import { Modal } from "@/components/ui/modal";
import { PreorderForm } from "@/features/preorder/components/preorder-form";
import { useI18n } from "@/lib/i18n/provider";

interface PreorderModalProps {
  open: boolean;
  onClose: () => void;
}

export function PreorderModal({ open, onClose }: PreorderModalProps) {
  const { t } = useI18n();

  return (
    <Modal open={open} onClose={onClose} title={t.preorderTitle}>
      <PreorderForm onClose={onClose} />
    </Modal>
  );
}
