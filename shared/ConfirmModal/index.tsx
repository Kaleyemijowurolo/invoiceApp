"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import styles from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  type?: "delete" | "update";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  type = "delete",
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
}) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.modalOverlay}
      ${styles[darkMode ? "dark-mode" : "light-mode"]} `}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.cancel}`}
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            className={`${styles.button} ${styles[type]}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
