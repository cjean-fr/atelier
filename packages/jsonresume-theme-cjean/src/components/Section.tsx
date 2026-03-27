import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface SectionProps extends StandardAttributes {
  name?: string;
}

export default function Section({ name, children, ...props }: SectionProps) {
  const sectionId = name
    ? `section-${name.toLowerCase().replace(/\s+/g, "-")}`
    : undefined;

  return (
    <section aria-labelledby={sectionId} {...props}>
      {name && (
        <h2
          id={sectionId}
          className="before:bg-primary relative mt-8 mb-4 break-after-avoid text-2xl tracking-tight text-gray-900 before:absolute before:-bottom-1 before:left-0 before:h-1 before:w-[3ch] before:rounded-[0_0.25rem_0.25rem_0] dark:text-white before:print:[print-color-adjust:exact]"
        >
          {name}
        </h2>
      )}
      {children}
    </section>
  );
}
