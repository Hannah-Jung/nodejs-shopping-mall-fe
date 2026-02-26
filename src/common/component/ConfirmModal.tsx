import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  variant?: "danger" | "primary";
  confirmButtonDisabled?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = "CANCEL",
  confirmText = "CONFIRM",
  variant = "primary",
  confirmButtonDisabled = false,
}: ConfirmModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <AlertDialogContent className="max-w-[90vw] sm:max-w-[400px] !p-0 overflow-hidden border border-zinc-200 shadow-2xl bg-white rounded-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8"
            >
              <AlertDialogHeader className="relative flex flex-col items-center justify-center text-center sm:text-center w-full !grid-cols-1">
                <AlertDialogTitle className="text-lg font-black tracking-tight text-zinc-900 uppercase w-full block text-center !col-start-1">
                  {title}
                </AlertDialogTitle>

                <div className="pt-6 text-sm font-medium text-zinc-500 leading-relaxed w-full flex flex-col items-center">
                  {description}
                </div>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
                <AlertDialogCancel
                  onClick={onClose}
                  className="h-12 flex-1 cursor-pointer font-bold uppercase tracking-widest border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-all"
                >
                  {cancelText}
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={confirmButtonDisabled}
                  onClick={onConfirm}
                  className={cn(
                    "h-12 flex-1 cursor-pointer font-bold uppercase tracking-widest text-white transition-all shadow-md active:scale-95",
                    variant === "danger"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-zinc-900 hover:bg-zinc-800",
                  )}
                >
                  {confirmText}
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        )}
      </AnimatePresence>
    </AlertDialog>
  );
};

export default ConfirmModal;
