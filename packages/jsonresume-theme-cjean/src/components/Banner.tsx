import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface BannerProps extends StandardAttributes {
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
    <header className="flex-1 grow border-b border-gray-100 pb-8 dark:border-white/5" {...props}>
      <h1 className="text-primary kerning-normal inline-block text-5xl font-extrabold tracking-tight uppercase sm:text-6xl">
        {name}
      </h1>
      {label && (
        <p className="mt-2 text-2xl font-light tracking-wide text-gray-500 dark:text-slate-400">
          {label}
        </p>
      )}
      {children}
    </header>
  );
}
