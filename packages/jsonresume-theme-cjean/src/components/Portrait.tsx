import { t } from "../lib/i18n.js";
import { type StandardAttributes } from "@cjean/jsx-string";

interface PortraitProps extends StandardAttributes {
  image: string;
  name: string;
  qrCode: string;
}

export default function Portrait({
  image,
  name,
  qrCode,
  ...props
}: PortraitProps) {
  return (
    <div className="portrait-card" {...props}>
      {/* Front: Circular Portrait */}
      <img
        src={image}
        alt={t("portrait_alt", { name })}
        className="portrait-card__side portrait-card__front"
      />

      {/* Back: Square QR Code */}
      <div className="portrait-card__side portrait-card__back">
        <img src={qrCode} alt="QR Code" loading="lazy" />
      </div>
    </div>
  );
}
