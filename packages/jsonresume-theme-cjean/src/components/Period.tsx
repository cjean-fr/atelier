import { t } from "../lib/i18n.js";
import DateTime, { type DateTimeProps } from "./DateTime.js";
import type { StandardAttributes } from "@cjean-fr/jsx-string";

interface PeriodProps extends StandardAttributes {
  startDate?: string | Date;
  endDate?: string | Date;
  format?: DateTimeProps["format"];
}

export default function Period({
  startDate,
  endDate,
  format,
  ...props
}: PeriodProps) {
  if (!startDate && !endDate) return null;

  return (
    <div {...props}>
      {startDate ? (
        <>
          <DateTime date={startDate} format={format} />
          {"\u00A0\u2014\u00A0"}
          {endDate ? (
            <DateTime date={endDate} format={format} />
          ) : (
            <span className="text-primary font-bold">{t("present")}</span>
          )}
        </>
      ) : (
        <DateTime date={endDate!} format={format} />
      )}
    </div>
  );
}
