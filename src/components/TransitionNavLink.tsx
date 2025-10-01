"use client"

import { animatePageOut } from '@/utils/animations'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface Props {
    href: string,
    label: string,
}

const TransitionNavLink = ({href, label}: Props) => {

    const pathname = usePathname()
    const router = useRouter()

    const handleClick = () => {
        if (pathname !== href) {
            animatePageOut(href, router)
        }
    }
  return (
    <button onClick={handleClick} className='text-xl hover:text-neutral-950'>{label}</button>
  )
}

export default TransitionNavLink