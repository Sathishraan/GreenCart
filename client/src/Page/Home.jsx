import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

// Eagerly load MainBanner for fast initial render
import MainBanner from '../Components/MainBanner';

// Lazy load other components to improve initial page load
const Categories = lazy(() => import('../Components/Categories'));
const Bestseller = lazy(() => import('../Components/Bestseller'));
const BottomBanner = lazy(() => import('../Components/BottomBanner'));
const NewsLetter = lazy(() => import('../Components/NewsLetter'));
const Footer = lazy(() => import('../Components/Footer'));

// Lazy loading section with Intersection Observer
const LazySection = ({ children, placeholder = null }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [sectionRef, setSectionRef] = useState(null);

    useEffect(() => {
        if (!sectionRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px', threshold: 0.1 }
        );

        observer.observe(sectionRef);

        return () => {
            if (sectionRef) observer.disconnect();
        };
    }, [sectionRef]);

    return (
        <div ref={setSectionRef} className="min-h-[50px] contain-content">
            {isVisible ? (
                <Suspense fallback={placeholder || <div className="h-24 bg-gray-100 animate-pulse rounded" />}>
                    {children}
                </Suspense>
            ) : (
                placeholder || <div className="h-24 bg-gray-100 animate-pulse rounded" />
            )}
        </div>
    );
};

const Home = () => {
    const { isLoading } = useAppContext();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-xl">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="mt-10 content-visibility-auto">
            {/* MainBanner loaded eagerly for immediate visibility */}
            <MainBanner />

            {/* Load other sections as they come into view */}
            <LazySection>
                <Categories />
            </LazySection>

            <LazySection>
                <Bestseller />
            </LazySection>

            <LazySection>
                <BottomBanner />
            </LazySection>

            <LazySection>
                <NewsLetter />
            </LazySection>

            <LazySection>
                <Footer />
            </LazySection>
        </div>
    );
};

export default Home;