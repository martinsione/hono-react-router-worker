import type { LoaderFunction, MetaFunction } from "react-router";
import { Link, useLocation } from "react-router";
import type * as Route from "types:views/+types.home";
import { Button } from "~/app/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Home Page" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

// export const loader = async (args: Route.LoaderArgs) => {
//   return {
//     message: "Hello from loader",
//   };
// };

export default function Index({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  return (
    <div className="flex h-screen items-center justify-center">
      <Button>Click me</Button>
      <div className="flex flex-col items-center gap-16 [&>a]:text-blue-500 [&>a]:hover:text-blue-600 [&>a]:hover:underline">
        {/* <h1 className="leading text-2xl font-medium text-gray-800 dark:text-gray-100">
          Welcome to <span className="font-black">{location.pathname}</span>
        </h1>
        <p>Location: {JSON.stringify(location)}</p> */}

        <Link to="/home">Homepage</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/">Index</Link>
      </div>
    </div>
  );
}
