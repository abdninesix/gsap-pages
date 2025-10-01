"use client"

import { animatePageOut } from '@/utils/animations'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface Props {
    href: string,
    label: string,
    className?: string
    children?: React.ReactNode
}

const TransitionLink = ({href, label, className}: Props) => {

    const pathname = usePathname()
    const router = useRouter()

    const handleClick = () => {
        if (pathname !== href) {
            animatePageOut(href, router)
        }
    }
  return (
    <button onClick={handleClick} className={className}>{label}</button>
  )
}

export default TransitionLink