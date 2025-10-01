import React from 'react'
import TransitionNavLink from './TransitionNavLink'

const Navbar = () => {
  return (
    <div className='w-full h-[5vh] sticky backdrop-blur-xs top-0 flex place-items-center justify-between py-4 px-32'>
        <h1 className='text-3xl tracking-tight font-bold text-neutral-800'>Hi</h1>
        <div className='flex gap-6'>
            <TransitionNavLink href='/' label='Home'/>
            <TransitionNavLink href='/about' label='About'/>
            <TransitionNavLink href='/work' label='Work'/>
        </div>
    </div>
  )
}

export default Navbar