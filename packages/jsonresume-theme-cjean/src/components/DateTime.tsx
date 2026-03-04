import { dateFormatter } from "../lib/i18n.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface DateTimeProps extends StandardAttributes {
  date: Date | string;
}

export default function DateTime({ date, children, ...props }: DateTimeProps) {
  const normalizedDate = dateFormatter.normalize(date);
  if (!normalizedDate) return <span {...props}>{children}</span>;

  return (
    <time dateTime={dateFormatter.toISO(normalizedDate)} {...props}>
      {children}
    </time>
  );
}
