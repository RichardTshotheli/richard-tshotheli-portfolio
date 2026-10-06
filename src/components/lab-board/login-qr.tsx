import { useEffect, useState } from "react";
import QRCode from "qrcode";

import { loginLink } from "@/lib/lab-links";

export function LoginQr({
  number,
  caption = "Scan to open CSE Labs, then sign in.",
  size = 168,
}: {
  number?: string;
  caption?: string;
  size?: number;
}) {
  const value = loginLink(number);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(value, {
      margin: 1,
      width: size * 2,
      errorCorrectionLevel: "M",
      color: { dark: "#0a5796", light: "#ffffff" },
    }).then((url) => {
      if (active) setSrc(url);
    });
    return () => {
      active = false;
    };
  }, [value, size]);

  return (
    <figure className="grid justify-items-center gap-2">
      <div className="rounded-2xl bg-white p-2 shadow-sm" style={{ width: size + 16, height: size + 16 }}>
        {src ? (
          <img src={src} width={size} height={size} alt="QR code that opens CSE Labs" className="h-full w-full" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">Preparing QR…</div>
        )}
      </div>
      <figcaption className="max-w-[14rem] text-center text-xs leading-relaxed">{caption}</figcaption>
    </figure>
  );
}
