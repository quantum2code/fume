import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/shop")({
  component: Shop,
});

function Shop() {
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold">Shop</h3>
      <p>Browse the shop.</p>
    </div>
  );
}
