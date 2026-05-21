import '@/styles/design-system.css'
import '@/styles/base.css'
import '@/styles/icons.css'
import AppProvidersWrapper from '@/components/wrapper/AppProvidersWrapper'
import { DEFAULT_PAGE_TITLE } from '@/context/constants'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import { ReduxProvider } from './ReduxProvider'
import ClientToast from '@/components/ClientToast'
import { ThemeProvider } from '../context/BrandingContext'
import { getBrandingByClientId } from '../utils/branding'
import Icons from '@/components/ui/Icons'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export async function generateMetadata() {
  const branding = await getBrandingByClientId()
  return {
    title: {
      template: `%s | ${branding.name}`,
      default: branding.name || 'Vendral',
    },
    description: DEFAULT_PAGE_TITLE,
    openGraph: {
      title: branding.name,
      description: DEFAULT_PAGE_TITLE,
      images: [branding.faviconUrl],
    },
  }
}

export default async function RootLayout({ children }) {
  const branding = await getBrandingByClientId()
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <link rel="icon" href={branding.faviconUrl} type="image/x-icon" />
      </head>
      <body>
        <Icons />
        <ThemeProvider>
          <ReduxProvider>
            <ClientToast />
            <AppProvidersWrapper>{children}</AppProvidersWrapper>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
