import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { user } = await verifySession();
  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Clients</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no products
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start selling as soon as you add a product.
          </p>
          <Button className="mt-4">Add Product</Button>
        </div>
      </div>
    </main>
  );
}
