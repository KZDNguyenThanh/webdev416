import React from "react";
import Container from "./Container";
import { cn } from "@/lib/utils";

interface Props {
  /** Mono eyebrow label above the title. */
  eyebrow?: string;
  /** Main heading (rendered in the Archivo display face). */
  title: React.ReactNode;
  /** Optional supporting line under the title. */
  subtitle?: React.ReactNode;
  /** Optional slot for actions / toolbar under the copy. */
  children?: React.ReactNode;
  /** Vertical rhythm — compact by default, "lg" for landing-style banners. */
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Shared cinematic page banner: near-black ink surface with the drifting tech
 * grid, scanlines and vignette used on the homepage hero. Gives every section
 * of the site the same "Endfield" header language (mono eyebrow + Archivo
 * title + restrained amber accent).
 */
const PageHero = ({
  eyebrow,
  title,
  subtitle,
  children,
  size = "sm",
  className,
}: Props) => {
  return (
    <section
      className={cn(
        "cine-surface relative overflow-hidden border-b border-white/10",
        className,
      )}
    >
      {/* atmosphere layers */}
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 78% 30%, rgba(227,178,60,0.12), transparent 55%)",
        }}
      />
      <div className="scanlines cine-vignette absolute inset-0" aria-hidden />

      <Container
        className={cn(
          "relative",
          size === "lg" ? "py-16 sm:py-24" : "py-12 sm:py-16",
        )}
      >
        {eyebrow ? (
          <p className="section-eyebrow flex items-center gap-2.5 text-signal">
            <span className="signal-pulse inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            {eyebrow}
          </p>
        ) : null}

        <h1
          className={cn(
            "display-title mt-3 max-w-3xl text-white",
            size === "lg" ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl",
          )}
        >
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
            {subtitle}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </section>
  );
};

export default PageHero;
