import { toast } from "sonner";

export const showToast = (message: string) => {
  toast.error(message, {
    action: {
      label: "OK",
      onClick: () => console.log("User acknowledged the warning"),
    },
  });
};
