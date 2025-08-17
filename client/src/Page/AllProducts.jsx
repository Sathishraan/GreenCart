import React, { useEffect, useState } from 'react';
import Products from '../Components/Products';
import { useAppContext } from '../context/AppContext';

const AllProducts = () => {

    const { searchQuery, setSearchQuery, products } = useAppContext();
    const [filteredProducts, setFilterProducts] = useState();

    useEffect(() => {
        if (searchQuery.length > 0) {
            setFilterProducts(products.filter(product => product.name.toLowerCase().include(SearchQuery.toLowerCase())))

        }
        else {
            setFilterProducts(products)
        }
    },[products,searchQuery])
    return (
        <div className='m-16 flex   flex-col'>
            <div className='flex flex-col items-end w-max'>
                <div className='text-2xl sm:text-4xl font-semibold '>All Products</div>
            </div>

            {/* A small horizontal line */}
            <div className='w-6 h-0.5 bg-primary rounded-full mb-4'></div>

            {/* Display filtered products */}
            <div className="grid gap-4 sm:grid-cols-2  md:gap-y-10  lg:grid-cols-5">
                {filteredProducts && filteredProducts
                    .filter((product) => product.inStock)
                    .map((product, index) => (
                        <Products key={index} product={product}  />
                    ))}
            </div>
        </div>
    )
}

export default AllProducts