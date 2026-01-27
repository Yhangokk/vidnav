import type { SiteConfig } from '@/types/site'
import type { NavigationData, NavigationItem, NavigationSubItem } from '@/types/navigation'

export function processSiteData(siteDataRaw: any): SiteConfig {
    return {
        ...siteDataRaw,
        appearance: {
            ...siteDataRaw.appearance,
            theme: (siteDataRaw.appearance?.theme === 'light' ||
                siteDataRaw.appearance?.theme === 'dark' ||
                siteDataRaw.appearance?.theme === 'system')
                ? siteDataRaw.appearance.theme
                : 'system'
        },
        navigation: {
            linkTarget: (siteDataRaw.navigation?.linkTarget === '_blank' ||
                siteDataRaw.navigation?.linkTarget === '_self')
                ? siteDataRaw.navigation.linkTarget
                : '_blank'
        }
    } as SiteConfig
}

export function filterNavigationData(navigationData: { navigationItems: any[] }): NavigationData {
    const filteredItems = navigationData.navigationItems
        .filter(category => category.enabled !== false)
        .map(category => {
            const filteredSubCategories = category.subCategories
                ? category.subCategories
                    .filter((sub: any) => sub.enabled !== false)
                    .map((sub: any) => ({
                        ...sub,
                        items: sub.items?.filter((item: any) => item.enabled !== false)
                    }))
                : undefined

            return {
                ...category,
                items: category.items?.filter((item: any) => item.enabled !== false),
                subCategories: filteredSubCategories
            }
        }) as NavigationItem[]

    return {
        navigationItems: filteredItems
    }
}

export function getProcessedData(navigationDataRaw: any, siteDataRaw: any) {
    const siteData = processSiteData(siteDataRaw)
    const navigationData = filterNavigationData(navigationDataRaw)

    return {
        siteData,
        navigationData
    }
}
