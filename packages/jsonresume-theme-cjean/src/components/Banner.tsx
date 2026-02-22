import type { StandardAttributes } from "@cjean/jsx-string";

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
    <header className="flex-1 grow pr-14 md:pr-0" {...props}>
      <h1 className="text-primary kerning-none inline-block text-4xl font-bold tracking-widest uppercase">
        {name}
      </h1>
      {label && <p className="text-3xl">{label}</p>}
      {children}
    </header>
  );
}
