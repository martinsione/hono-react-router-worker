export default function Component() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center">
      <div className="flex max-w-lg flex-col items-center justify-center gap-y-6">
        <h1 className="text-center text-4xl/none font-semibold text-balance">
          Page Not Found
        </h1>

        <p className="text-center text-lg/normal text-balance">
          We're sorry, but an unexpected error has occurred. Please try again
          later or contact support if the issue persists.
        </p>
      </div>
    </main>
  );
}
