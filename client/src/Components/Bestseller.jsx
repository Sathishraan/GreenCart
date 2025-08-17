import React from 'react';
import { useAppContext } from '../context/AppContext';
import Products from './Products';

// Simple product placeholder to prevent reflow
const ProductPlaceholder = () => (
  <div className="bg-gray-100 rounded-md h-64"></div>
);

const Bestseller = () => {
    const { products, isLoading } = useAppContext();

    if (isLoading) {
        // Use fixed height placeholders to prevent layout shifts
        return (
            <div className='sm:m-10 m-5'>
                <div className='bg-gray-200 h-10 w-48 mb-8 rounded-md'></div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {[...Array(5)].map((_, index) => (
                        <ProductPlaceholder key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return <div className="text-gray-500 p-4">No products available</div>;
    }

    // Filter products once to avoid recalculation during render
    const bestsellerProducts = products
        .filter(product => product.inStock)
        .slice(0, 5);

    return (
        <div className='sm:m-10 m-5'>
            <h1 className='font-semibold md:text-5xl text-3xl'>BestSeller</h1>

            <div className='sm:mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {bestsellerProducts.map((product, index) => (
                    <Products key={product._id || index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default React.memo(Bestseller);