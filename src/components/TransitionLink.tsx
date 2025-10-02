"use client"

import { animatePageOut } from '@/utils/animations'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  href: string,
  className?: string
  children?: React.ReactNode
  onComplete?: () => void;
}

const TransitionLink = ({ href, children, className, onComplete }: Props) => {

  const pathname = usePathname()
  const router = useRouter()

  const handleClick = async () => {
    if (pathname !== href) {
      await animatePageOut(href, router)
      if (onComplete) onComplete();
    }
  }
  return (
    <button onClick={handleClick} className={`cursor-pointer ${className}`}>{children}</button>
  )
}

export default TransitionLink