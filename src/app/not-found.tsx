import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          This page wandered off.
        </h1>
        <p className="mt-2 max-w-sm text-fg-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lift"
        >
          <ArrowLeft size={16} />
          Back home
        </Link>
      </div>
    </Container>
  );
}
