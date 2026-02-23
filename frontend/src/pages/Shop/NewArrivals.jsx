import React from 'react';
import ShopPage from '../ShopPage';

const NewArrivals = () => {
    // New Arrivals maps to 'newest' sort order.
    return <ShopPage initialSort="newest" />;
};

export default NewArrivals;
