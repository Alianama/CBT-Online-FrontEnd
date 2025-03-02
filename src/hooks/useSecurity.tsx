import { useCallback } from "react";
import { toast } from "sonner";

const isSecurityEnabled: boolean = true;

export default function useSecurity() {
  const showToast = (message: string) => {
    toast.error(message, {
      action: {
        label: "OK",
        onClick: () => console.log("User acknowledged the warning"),
      },
    });
  };

  const disableRightClick = useCallback((e: MouseEvent) => {
    if (!isSecurityEnabled) return;
    e.preventDefault();
    showToast("Klik kanan tidak diperbolehkan!");
  }, []);

  const disableShortcut = useCallback((e: KeyboardEvent) => {
    if (!isSecurityEnabled) return;
    const forbiddenKeys = ["u", "i", "c", "x", "v", "s", "j", "k", "f12"];
    if (
      (e.ctrlKey && forbiddenKeys.includes(e.key.toLowerCase())) ||
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(e.key.toLowerCase()))
    ) {
      e.preventDefault();
      showToast("Shortcut ini tidak diperbolehkan!");
    }
  }, []);

  return { disableRightClick, disableShortcut, isSecurityEnabled, showToast };
}
