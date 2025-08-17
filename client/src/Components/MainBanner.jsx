
import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const MainBanner = () => {
    return (
        <div className='relative  mt-20'>
            {/* Banner images */}

            <div className='md:m-15 m-5'>
                <img src={assets.main_banner_bg} alt="Main Banner" className='w-full hidden md:block' />
                <img src={assets.main_banner_bg_sm} alt="Main Banner Small" className='w-full md:hidden ' />
            </div>


            {/* Headline text */}
            <div className=' absolute top-90 left-6 right-6 md:top-24 md:left-20 md:right-auto md:max-w-xl'>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left leading-tight'>
                    Freshness you can trust, savings you will love
                </h1>
            </div>

            {/* Buttons */}
            <div className='absolute bottom-10 left-15 right-6 md:bottom-24 md:left-20 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                <Link to='/product' className='group flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded transition'>
                    Shop now
                    <img src={assets.black_arrow_icon} alt="Arrow" className='w-4 h-4 transition group-hover:translate-x-1' />
                </Link>

                <Link to='/product' className='group flex items-center gap-2 px-6 py-3 border border-gray-300 rounded transition'>
                    Explore
                    <img src={assets.black_arrow_icon} alt="Arrow" className='w-4 h-4 transition group-hover:translate-x-1' />
                </Link>
            </div>
        </div>
    )
}

export default MainBanner
