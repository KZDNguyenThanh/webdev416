import "./globals.css";
import { Be_Vietnam_Pro, Archivo, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

// Industrial display face for kinetic hero headlines (supports Vietnamese).
const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

// Technical monospace for the cinematic HUD labels / tickers.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
};
export default RootLayout;
