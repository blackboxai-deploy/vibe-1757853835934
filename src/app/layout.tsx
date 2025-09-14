import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { CartProvider } from '@/components/CartProvider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PrivateInstance - Premium Software & Custom Solutions',
  description: 'Your trusted source for premium software licenses and custom development solutions. Get instant access to professional tools and bespoke software tailored to your needs.',
  keywords: 'software licenses, custom software development, premium tools, automation, security software',
  authors: [{ name: 'PrivateInstance Team' }],
  openGraph: {
    title: 'PrivateInstance - Premium Software & Custom Solutions',
    description: 'Your trusted source for premium software licenses and custom development solutions.',
    url: 'https://privateinstance.com',
    siteName: 'PrivateInstance',
    images: [
      {
        url: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/15784c43-67b1-461b-8525-a0d71677376e.png',
        width: 1200,
        height: 630,
        alt: 'PrivateInstance - Premium Software Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrivateInstance - Premium Software & Custom Solutions',
    description: 'Your trusted source for premium software licenses and custom development solutions.',
    images: ['https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3f7d10ba-f1a5-48a5-b971-4739aeb57cd2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="relative min-h-screen">
                {/* Background gradient overlay */}
                <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black/40 to-purple-900/20 pointer-events-none" />
                
                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-purple-500/10 via-transparent to-transparent rounded-full animate-pulse" />
                  <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-600/10 via-transparent to-transparent rounded-full animate-pulse delay-1000" />
                </div>

                {/* Main content */}
                <div className="relative z-10">
                  {children}
                </div>
              </div>
              
              {/* Toast notifications */}
              <Toaster
                theme="dark"
                className="toaster group"
                toastOptions={{
                  classNames: {
                    toast: "group toast group-[.toaster]:bg-purple-900/90 group-[.toaster]:text-white group-[.toaster]:border-purple-700/50 group-[.toaster]:shadow-lg backdrop-blur-sm",
                    description: "group-[.toast]:text-purple-200",
                    actionButton: "group-[.toast]:bg-purple-600 group-[.toast]:text-white group-[.toast]:hover:bg-purple-500",
                    cancelButton: "group-[.toast]:bg-gray-600 group-[.toast]:text-white group-[.toast]:hover:bg-gray-500",
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}