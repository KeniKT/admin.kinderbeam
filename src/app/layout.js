import "./globals.css";

export const metadata = {
  title: "KinderBeam Admin Portal",
  description: "Admin portal for KinderBeam",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}