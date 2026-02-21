import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, ShoppingCart } from "lucide-react";
import api from "@/utils/api";

const AdminDashboardPage = () => {
  const [productCount, setProductCount] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productRes, orderRes] = await Promise.allSettled([
          api.get<{ totalCount?: number; productList?: unknown[] }>(
            "/product",
            {
              params: { page: 1, name: "" },
            },
          ),
          api.get<{ totalCount?: number; orderList?: unknown[] }>("/order", {
            params: { page: 1 },
          }),
        ]);

        if (productRes.status === "fulfilled") {
          const data = productRes.value.data;
          const count = data?.totalCount ?? data?.productList?.length ?? 0;
          setProductCount(count);
        }

        if (orderRes.status === "fulfilled") {
          const data = orderRes.value.data;
          const count = data?.totalCount ?? data?.orderList?.length ?? 0;
          setOrderCount(count);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Admin Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 max-w-4xl">
        <Link
          to="/admin/product"
          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-none"
        >
          <Card className="h-full border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary">
                <Package className="size-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Product Management</CardTitle>
                <CardDescription>Product Management</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">
                  {productCount}
                </span>{" "}
                Products Registered
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link
          to="/admin/order"
          className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-none"
        >
          <Card className="h-full border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary">
                <ShoppingCart className="size-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Order Management</CardTitle>
                <CardDescription>Order Management</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{orderCount}</span>{" "}
                Pending Orders
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
