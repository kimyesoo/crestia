import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://crestia.vercel.app'
    const locales = ['ko', 'en']

    const routes = [
        '/',
        '/guide',
        '/guide/beginner',
        '/guide/morphs',
        '/tools',
        '/tools/calculator',
        '/tools/naming',
        '/tools/contract',
        '/market',
        '/market/shop',
        '/lineage',
    ]

    return routes.flatMap((route) =>
        locales.map((locale) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '/' ? 1 : 0.8,
        }))
    )
}
