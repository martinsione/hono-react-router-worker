import type { MetaFunction } from "react-router";
import { Link, useLocation } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Home Page" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export default function Index() {
  const location = useLocation();
  return (
    <div className="flex h-screen items-center justify-center">
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
