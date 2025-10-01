import React from 'react'
import TransitionLink from './TransitionLink'

const Navbar = () => {
  return (
    <div>
      <h1>Hi</h1>
      <div>
        <TransitionLink href='/' label='Home' />
        <TransitionLink href='/about' label='About' />
        <TransitionLink href='/work' label='Work' />
      </div>
    </div>
  )
}

export default Navbar