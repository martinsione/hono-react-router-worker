import { Link } from "react-router";
export default function Component() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center">
      <div className="flex max-w-lg flex-col items-center justify-center gap-y-6">
        <h1 className="text-center text-4xl/none font-semibold text-balance">
          Page Not Found
        </h1>

        <Link to="/" className="mt-4 hover:underline">
          Go back to the home page
        </Link>
      </div>
    </main>
  );
}
