// lib/branding.ts



const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
const url = `https://sprucesol.com/${clientId}/branding.json`
export async function getBrandingByClientId(clientId) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 7200 }
    })
    if (!res.ok) throw new Error('Branding fetch failed')
    return await res.json()
    
  } catch (error) {
    // Fallback default branding
    return {
      companyName: 'My App',
      pageTitle: 'Welcome',
      faviconUrl: '/favicon.ico',
      description: 'Default description',
    }
  }
}