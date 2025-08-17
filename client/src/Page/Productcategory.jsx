import React from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import Products from '../Components/Products';
import { useAppContext } from '../context/AppContext';

const Productcategory = () => {

    const { products } = useAppContext();
    const { category } = useParams();

    const searchCategory = categories.find((item) => item.path.toLowerCase() === category)

    const filterProduct = products.filter(
        (product) => product.category?.toLowerCase() === category
    );


    return (
        <div className='mt-15 m-10'>
            {searchCategory && (
                <div className='flex flex-col items-end w-max'>
                    <p className='md:text-5xl '>{searchCategory.text.toUpperCase()}</p>
                </div>
            )}

            {filterProduct.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 md:gap-5 mt-6'>{filterProduct.map((product) => (
                    <Products key={product._id} product={product} />
                ))}</div>
            ) : (
                <div className='sm:text-5xl text-3xl'>No Product Found</div>
            )}

        </div>
    )
}

export default Productcategory