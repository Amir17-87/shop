import './App.css';
// import { Col , Row } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import Cart from './components/Cart';
import Content from './components/Content';
import LandingLayout from './components/LandingLayout';
import LogIn from './components/LogIn';
import Product from './components/Product';
import Products from './components/Products';
import Register from './components/Register';
import { useEffect, useState } from 'react';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import NotFound from './components/NotFound';
import 'aos/dist/aos.css';
import Aos from 'aos';
import ViewProduct from './components/ViewProduct';
import axios from 'axios';
import HighestPricePage from './components/HighestPricePage';
import ViewProductGroups from './components/ViewProductGroupsPage';
import Gemini from './components/gemini';


const App = () => {
  useEffect(() => {

    
    // Set default authorization header for future requests
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }


    Aos.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  // const [product, setProduct] = useState({
  //   name: "",
  //   price: "",
  //   image: "",
  //   description: "",
  //   group: 0
  // });

  // const [forceRender, setForceRender] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [filteredProducts, setFilteredProducts] = useState([]);


  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<LandingLayout />} >
          <Route path='' element={<Content />} />
          <Route path='*' element={<NotFound />} />
          <Route path='register' element={<Register />} />
          <Route path='login' element={<LogIn />} />
          <Route path='products' element={<Products />} />
          <Route path='products/highestprice' element={<HighestPricePage />} />
          <Route path="/products/:productId" element={<ViewProduct />} />
          <Route path="/productgroups/:productGroupId" element={<ViewProductGroups />} />
          <Route path='cart' element={<Cart />} />
          <Route path='aboutus' element={<AboutUs />} />
          <Route path='contactus' element={<ContactUs />} />
          {/* <Route path='gemini' element={<Gemini/>}/> */}
        </Route>
      </Routes>
    </div>
  );
}




export default App;
