import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
    return (
        <div>
            <div className='relative sm:m-10 mt-24'>
                <img src={assets.bottom_banner_image} alt="Bottom_Banner" className='w-full hidden md:block' />
                <img src={assets.bottom_banner_image_sm} alt="Bottom_banner" className='w-full md:hidden' />

                <div className='absolute inset-0 flex flex-col md:items-end items-center md:justify-center pt-16 md:pt-0 md:pr-50'>

                    <h1 className='text-2xl md:text-5xl font-semibold mb-6 text-primary'>Why we are Best?</h1>

                    {features.map((feature,index) =>(
                        <div key={index} className='flex items-center  gap-4 mt-2'>
                            <img src={feature.icon} alt={feature.title}  className='md:w-11 w-9'/>
                            <h3 className='text-lg md:text-xl font-semibold'>{feature.title}</h3>
                            <p className='text-gray-500/70 text-xs md:text-sm'>{feature.description}</p>
                        </div>
                    ))}

                </div>
            </div>
            
            
        </div>
    )
}

export default BottomBanner