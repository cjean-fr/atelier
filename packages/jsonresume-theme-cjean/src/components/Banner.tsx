import type { JSX } from "@vincle/core";

interface BannerProps extends JSX.HTMLAttributes {
  name: string;
  label?: string;
}

export default function Banner({
  name,
  label,
  children,
  ...props
}: BannerProps) {
  return (
    <header className="flex-1 grow border-b border-gray-200 pb-6" {...props}>
      <h1 className="text-primary kerning-normal inline-block text-5xl font-bold tracking-[-0.055em] sm:text-6xl">
        {name}
      </h1>
      {label && (
        <p className="mt-2 text-xl font-medium tracking-tight text-gray-600 sm:text-2xl">
          {label}
        </p>
      )}
      {children}
    </header>
  );
}
