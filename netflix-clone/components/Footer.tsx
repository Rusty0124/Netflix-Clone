export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-brand-background px-6 py-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Netflix Clone &mdash; Built for
          learning purposes only. Not affiliated with Netflix.
        </p>
      </div>
    </footer>
  );
}
