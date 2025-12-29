import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, Ban, ChevronRight, Loader2 } from "lucide-react";
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

const statusConfig = {
  created: { label: "Order Created", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  paid: { label: "Paid", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  failed: { label: "Payment Failed", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  cancelled: { label: "Cancelled", icon: Ban, color: "text-muted-foreground", bg: "bg-muted" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const storedOrders = JSON.parse(localStorage.getItem("eventmart_orders") || "[]");
      setOrders(storedOrders.reverse());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Simulate status updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.status === "created" && Math.random() > 0.7) {
            const updated = { ...order, status: "paid" as const };
            // Update localStorage
            const stored = JSON.parse(localStorage.getItem("eventmart_orders") || "[]");
            const updatedStored = stored.map((o: Order) =>
              o.id === order.id ? updated : o
            );
            localStorage.setItem("eventmart_orders", JSON.stringify(updatedStored));
            return updated;
          }
          return order;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!isAuthenticated) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view orders</h1>
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

  return (
    <div className="container-main py-8 md:py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="h-20 w-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to create your first order</p>
          <Button onClick={() => navigate("/")}>Browse Products</Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/order/${order.id}`}
                  className="block bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors card-hover"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">{order.id}</span>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", status.bg, status.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"} • {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm truncate text-muted-foreground">
                        {order.items.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatPrice(order.total)}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
