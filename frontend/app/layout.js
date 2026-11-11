import "./globals.css";

export const metadata = {
  title: "Hazrazee Sadhan A. Daing | Portfolio",
  description: "Portfolio of Hazrazee Sadhan A. Daing, a BSIT Database Systems student and student leader.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
