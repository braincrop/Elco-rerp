import '@/assets/scss/style.scss'
import AppProvidersWrapper from '@/components/wrapper/AppProvidersWrapper'
import { DEFAULT_PAGE_TITLE } from '@/context/constants'
import { Roboto } from 'next/font/google'
import { ReduxProvider } from './ReduxProvider'
import ClientToast from '@/components/ClientToast'
import { ThemeProvider } from '../context/BrandingContext'
import { getBrandingByClientId } from '../utils/branding'

const roboto = Roboto({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})
export async function generateMetadata() {
  const branding = await getBrandingByClientId() 
  return {
    title: {
      template: `%s | ${branding.name}`,
      default: branding.name || 'Primi digital'
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
    <html lang="en">
      <head>
        <link rel="icon" href={branding.faviconUrl} type="image/x-icon" />
      </head>
      <body className={roboto.className} data-bs-theme="dark">
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
