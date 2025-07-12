import React from 'react'

const Hero = () => {
  return (
    <div className='bg-base-100'>
        <div
            className="hero h-[50vh]"
            style={{
                backgroundImage:`url(assets/bg.jpg)`,
            }}
        >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
        <div className="max-w-screen-md">
            <h1 className="mb-5 text-5xl font-bold font-sans">Buy & Sell Rare & Exclusive Products</h1>
            <p className="mb-5 text-lg font-sans">
                Discover antiques, collectibles, and limited edition treasures—or list your own!
            </p>
            <div className="flex items-center gap-x-4 justify-center">
                <button className="btn btn-primary font-sans">Explore Products</button>
                <button className="btn btn-primary font-sans">Upload Product</button>
            </div>
        </div>
        </div>
    </div>
    </div>
  )
}

export default Hero