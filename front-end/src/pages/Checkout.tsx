import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Loader2, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type PaymentStatus = "idle" | "processing" | "success" | "error";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [orderId, setOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to complete your order");
      navigate("/login");
      return;
    }

    setPaymentStatus("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 90% success rate simulation
    const success = Math.random() > 0.1;

    if (success) {
      const newOrderId = "ORD-" + Date.now().toString(36).toUpperCase();
      setOrderId(newOrderId);
      setPaymentStatus("success");
      
      // Store order in localStorage for demo
      const orders = JSON.parse(localStorage.getItem("eventmart_orders") || "[]");
      orders.push({
        id: newOrderId,
        items: items.map(i => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
        total: totalPrice,
        status: "created",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("eventmart_orders", JSON.stringify(orders));
      
      clearCart();
      toast.success("Order placed successfully!");
    } else {
      setPaymentStatus("error");
      toast.error("Payment failed. Please try again.");
    }
  };

  if (items.length === 0 && paymentStatus === "idle") {
    return (
      <div className="container-main py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items before checkout</p>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container-main py-8 md:py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <AnimatePresence mode="wait">
        {paymentStatus === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="h-24 w-24 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-2">Your order has been placed.</p>
            <p className="font-medium mb-8">Order ID: <span className="text-primary">{orderId}</span></p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/orders")}>Track Order</Button>
              <Button variant="outline" onClick={() => navigate("/")}>Continue Shopping</Button>
            </div>
          </motion.div>
        ) : paymentStatus === "error" ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="h-24 w-24 rounded-full bg-destructive/10 mx-auto flex items-center justify-center mb-6">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-8">Something went wrong. Please try again.</p>
            <Button onClick={() => setPaymentStatus("idle")}>Try Again</Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-5 gap-8"
          >
            {/* Payment Form */}
            <div className="md:col-span-3">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" required disabled={paymentStatus === "processing"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="4242 4242 4242 4242" required disabled={paymentStatus === "processing"} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" required disabled={paymentStatus === "processing"} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required disabled={paymentStatus === "processing"} />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={paymentStatus === "processing"}
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay {formatPrice(totalPrice)}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
