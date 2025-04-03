export const metadata = {
  title: 'Student QR System',
  description: 'Student QR code system with visual cryptography',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}