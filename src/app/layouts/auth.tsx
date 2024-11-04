import { Outlet } from "react-router";

export default function Component() {
  return (
    <div className="grid gap-8">
      <Outlet />
    </div>
  );
}
