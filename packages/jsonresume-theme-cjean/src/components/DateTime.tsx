import { dateFormatter } from "../lib/i18n.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

export interface DateTimeProps extends StandardAttributes {
  date: Date | string;
  format?: Parameters<typeof dateFormatter.format>[1];
  children?: any;
}

export default function DateTime({
  date,
  format,
  children,
  ...props
}: DateTimeProps) {
  const normalizedDate = dateFormatter.normalize(date);
  if (!normalizedDate) return <span {...props}>{children}</span>;

  let content = children;
  if (format && !content) {
    content = dateFormatter.format(normalizedDate, format);
  }

  return (
    <time dateTime={dateFormatter.toISO(normalizedDate)} {...props}>
      {content}
    </time>
  );
}
