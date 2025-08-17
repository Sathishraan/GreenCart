import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

    const { navigate } = useAppContext()

    return (
        <div className='md:mt-10 mt-5 sm:m-10 m-3'>

            <h1 className='text-3xl md:text-5xl font-semibold'>Categories</h1>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mt-6 gap-6'>


                {categories.map((categorie, index) => (

                    <div key={index} className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex
                flex-col justify-center items-center '
                        style={{ background: categorie.bgColor }}
                        onClick={() => {
                            navigate(`/product/${categorie.path.toLowerCase()}`);
                            scrollTo(0, 0)
                        }}>
                        <img src={categorie.image} alt={categorie.text} className='group-hover:scale-128 transition max-w-29' />
                        <p className='text-sm font-medium'>{categorie.text}</p>
                    </div>
                ))  }
            </div>



        </div>
    )
}

export default Categories