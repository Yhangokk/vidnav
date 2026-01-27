'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'
import type { NavigationSubItem } from '@/types/navigation'
import type { SiteConfig } from '@/types/site'

interface VideoCardProps {
    item: NavigationSubItem
    siteConfig?: SiteConfig
}

export function VideoCard({ item, siteConfig }: VideoCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { videoConfig } = item

    const isExternalIcon = item.icon?.startsWith('http')
    const isLocalIcon = item.icon && !isExternalIcon

    const iconPath = isLocalIcon && item.icon
        ? item.icon.startsWith('/')
            ? item.icon
            : `/${item.icon}`
        : item.icon || '/placeholder-icon.png'

    const handleCardClick = (e: React.MouseEvent) => {
        if (videoConfig) {
            e.preventDefault()
            setIsOpen(true)
        }
    }

    const renderVideoTitle = () => (
        <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{item.title}</span>
            {/* 可以在这里添加来源图标等 */}
        </div>
    )

    const renderVideoContent = () => {
        if (!videoConfig) return null

        if (videoConfig.type === 'bilibili') {
            const { bvid, aid, cid, p = 1 } = videoConfig
            const src = `//player.bilibili.com/player.html?isOutside=true&aid=${aid}&bvid=${bvid}&cid=${cid}&p=${p}&autoplay=1`

            return (
                <div className="w-full aspect-video">
                    <iframe
                        src={src}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        className="w-full h-full rounded-lg border-0"
                    ></iframe>
                </div>
            )
        }

        if (videoConfig.type === 'youtube') {
            const { videoId } = videoConfig
            return (
                <div className="w-full aspect-video">
                    <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )
        }

        return null
    }

    return (
        <>
            <Card
                className="group overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                onClick={handleCardClick}
            >
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0 w-12 h-12">
                            {item.icon && (
                                <img
                                    src={iconPath}
                                    alt={`${item.title} icon`}
                                    className="w-full h-full object-contain"
                                />
                            )}
                            {videoConfig && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 rounded-full transition-colors">
                                    <PlayCircle className="w-6 h-6 text-primary opacity-80 group-hover:opacity-100" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-base flex items-center gap-2">
                                {item.title}
                            </CardTitle>
                            {item.description && (
                                <CardDescription className="line-clamp-2 text-sm">
                                    {item.description}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {videoConfig && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black/90 border-zinc-800">
                        {/* 隐藏的标题，用于无障碍访问 */}
                        <div className='sr-only'>
                            <DialogTitle>{item.title}</DialogTitle>
                            <DialogDescription>Playing video: {item.title}</DialogDescription>
                        </div>

                        {/* 自定义头部，可选 */}
                        <div className="absolute top-2 right-2 z-50">
                            {/* Close button is automatically added by DialogContent usually, checking if we need manual one */}
                        </div>
                        {renderVideoContent()}
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
