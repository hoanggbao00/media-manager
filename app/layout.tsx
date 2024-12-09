import './globals.css'
import { Providers } from '../providers/providers'

export const metadata = {
  title: 'Media Management System',
  description: 'System for managing and displaying media content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        
      </body>
    </html>
  )
}