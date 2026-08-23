import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          Nothing here.
        </h1>
        <p className="mt-2 max-w-sm text-fg-muted">
          This page either moved or never existed. Either way, my fault.
        </p>
        <Button href="/" className="mt-8">
          <ArrowLeft size={16} />
          Back home
        </Button>
      </div>
    </Container>
  );
}
