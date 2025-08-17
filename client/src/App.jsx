import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';
import AdminLogin from './Components/AdminLogin';
import Loading from './Components/Loading';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import { useAppContext } from './context/AppContext';
import AddProduct from './Page/AddProduct';
import Address from './Page/Address';
import AdminLayout from './Page/AdminLayout';
import AllProducts from './Page/AllProducts';
import Cart from './Page/Cart';
import Home from './Page/Home';
import MyOrder from './Page/MyOrder';
import Orders from './Page/Orders';
import Productcategory from './Page/Productcategory';
import ProductDetails from './Page/ProductDetails';
import ProductList from './Page/ProductList';

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  const { showLogin, isAdmin } = useAppContext();

  return (
    <div>

      {isSellerPath ? null : <Navbar />}
      {showLogin ? <Login /> : null}

      <Toaster />

      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product' element={<AllProducts />} />
          <Route path='/product/:category' element={<Productcategory />} />
          <Route path='/product/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/add-address' element={<Address />} />
          <Route path='/myorder' element={<MyOrder />} />
          <Route path='/loader' element={<Loading />} />
          <Route path='/admin' element={isAdmin ? <AdminLayout /> : <AdminLogin />} >

            <Route index element={isAdmin ? <AddProduct /> : null} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />


          </Route>

        </Routes>
      </div>
    </div>
  )
}

export default App