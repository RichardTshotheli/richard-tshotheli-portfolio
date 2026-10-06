import { useEffect, useState } from "react";
import QRCode from "qrcode";

import { CSE_LABS_URL } from "@/lib/lab-links";

export function LoginQr({ size = 220 }: { size?: number }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(CSE_LABS_URL, {
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
  }, [size]);

  return (
    <div className="rounded-2xl bg-white p-2" style={{ width: size + 16, height: size + 16 }}>
      {src ? (
        <img src={src} width={size} height={size} alt="QR code for the CSE Labs link" className="h-full w-full" />
      ) : (
        <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">Preparing QR…</div>
      )}
    </div>
  );
}
