export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}
