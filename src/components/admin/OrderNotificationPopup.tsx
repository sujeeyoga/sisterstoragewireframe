import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OrderNotificationPopupProps {
  orderNumber: string;
  customerName: string;
  total: number;
  itemCount: number;
  onClose: () => void;
}

export const OrderNotificationPopup = ({
  orderNumber,
  customerName,
  total,
  itemCount,
  onClose,
}: OrderNotificationPopupProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 right-6 z-[10000] w-80 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-2xl border border-blue-400/50 overflow-hidden"
        >
          {/* MSN-style header */}
          <div className="bg-blue-600/80 px-4 py-2 flex items-center justify-between border-b border-blue-400/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white font-semibold text-sm">New Order</span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🛍️</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg leading-tight">
                  {customerName}
                </p>
                <p className="text-blue-100 text-xs">Order #{orderNumber}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-blue-50 text-sm">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-50 text-sm">Items</span>
                <span className="font-semibold">{itemCount}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="h-1 bg-white/40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
