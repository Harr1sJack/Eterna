import React from 'react'

const NavBar = () => {
  return (
  <div className="navbar bg-base-100 shadow-sm">
    <div className="flex-1">
      <a className="btn btn-disabled text-xl">Eterna</a>
    </div>
    <div className="flex gap-2">
      <a className="btn btn-ghost text-xl font-">EXPLORE PRODUCT</a>
      <a className="btn btn-ghost text-xl">UPLOAD PRODUCT</a>
      <a className="btn btn-ghost text-xl">MY UPLOADS</a>
      <a className="btn btn-ghost text-xl">LOGIN/SIGN UP</a>
    </div>
  </div>
  )
}

export default NavBar