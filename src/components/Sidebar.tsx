"use client"

import React from 'react'
import ThemeButton from './ThemeButton'
import { links } from '@/utils/data'
import TransitionLink from './TransitionLink'
import { usePathname } from 'next/navigation'

const Sidebar = () => {

    const pathName = usePathname();

    return (
        <div className='sticky border w-fit top-1/2 -rotate-90'>
            <div className="flex gap-4">
                <div className="nav-magnetic p-2"><ThemeButton /></div>
                <div className="hidden md:flex h-full">
                    {links.map((link) => (
                        <TransitionLink key={link.url} className='relative px-4 py-2 group nav-magnetic' href={link.url}>
                            {link.title.toUpperCase()}
                        </TransitionLink>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar