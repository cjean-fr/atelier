import type { JSX } from "@vincle/core";

interface SectionProps extends JSX.HTMLAttributes {
  name?: string;
  sectionId?: string;
}

export default function Section({
  name,
  sectionId: stableId,
  children,
  ...props
}: SectionProps) {
  const sectionId = stableId
    ? `section-${stableId}`
    : name
      ? `section-${name.toLowerCase().replace(/\s+/g, "-")}`
      : undefined;

  return (
    <section
      aria-labelledby={sectionId}
      className="content-visibility-auto [contain-intrinsic-size:auto_400px]"
      {...props}
    >
      {name && (
        <h2
          id={sectionId}
          className="before:bg-primary relative mt-10 mb-5 break-after-avoid border-b border-gray-200 pb-2 text-2xl font-semibold tracking-tight text-gray-900 before:absolute before:-bottom-px before:left-0 before:h-0.5 before:w-10 before:print:[print-color-adjust:exact]"
        >
          {name}
        </h2>
      )}
      {children}
    </section>
  );
}
