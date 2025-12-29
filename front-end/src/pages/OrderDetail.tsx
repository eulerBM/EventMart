import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, Ban, ArrowLeft, Loader2, CreditCard, Truck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "created" | "paid" | "failed" | "cancelled";
  createdAt: string;
}

const statusSteps = [
  { key: "created", label: "Order Created", icon: Package },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "paid", label: "Payment Confirmed", icon: CreditCard },
  { key: "shipping", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check },
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem("eventmart_orders") || "[]");
      const found = orders.find((o: Order) => o.id === id);
      setOrder(found || null);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  // Simulate status updates
  useEffect(() => {
    if (!order || order.status !== "created") return;

    const timer = setTimeout(() => {
      setOrder((prev) => prev ? { ...prev, status: "paid" } : null);
      const orders = JSON.parse(localStorage.getItem("eventmart_orders") || "[]");
      const updated = orders.map((o: Order) =>
        o.id === id ? { ...o, status: "paid" } : o
      );
      localStorage.setItem("eventmart_orders", JSON.stringify(updated));
    }, 8000);

    return () => clearTimeout(timer);
  }, [order, id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getCurrentStep = () => {
    if (!order) return 0;
    if (order.status === "failed" || order.status === "cancelled") return -1;
    if (order.status === "paid") return 2;
    return 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view order</h1>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-main py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
      </div>
    );
  }

  const currentStep = getCurrentStep();

  return (
    <div className="container-main py-8 md:py-16 max-w-3xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/orders")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{order.id}</h1>
            <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <span className="text-2xl font-bold text-primary">{formatPrice(order.total)}</span>
        </div>

        {/* Timeline */}
        {currentStep >= 0 ? (
          <div className="mb-8">
            <h2 className="font-semibold mb-6">Order Status</h2>
            <div className="relative">
              {statusSteps.slice(0, 3).map((step, index) => {
                const isComplete = index <= currentStep;
                const isCurrent = index === currentStep;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-4 pb-8 last:pb-0">
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          isComplete ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                          isCurrent && "ring-4 ring-primary/20"
                        )}
                      >
                        <StepIcon className="h-5 w-5" />
                      </motion.div>
                      {index < 2 && (
                        <div className={cn(
                          "absolute left-1/2 top-10 w-0.5 h-8 -translate-x-1/2",
                          index < currentStep ? "bg-primary" : "bg-border"
                        )} />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className={cn(
                        "font-medium",
                        isComplete ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {index === 0 ? "Waiting for payment confirmation..." : "Your order is being processed"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-xl bg-destructive/10 text-destructive flex items-center gap-3">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">
              {order.status === "failed" ? "Payment failed" : "Order cancelled"}
            </span>
          </div>
        )}

        {/* Items */}
        <div>
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate("/")}>Continue Shopping</Button>
        <Button variant="outline" onClick={() => navigate("/orders")}>View All Orders</Button>
      </div>
    </div>
  );
};

export default OrderDetail;
