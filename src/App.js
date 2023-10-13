import {Header} from "./components/Header/Header";
import {Home} from "./pages/Home/Home"
import {Settings} from "./pages/Settings/Settings"
import {SignIn} from "./pages/SignIn/SignIn"
import {Cart} from "./pages/Cart/Cart"
import {Checkout} from "./pages/Checkout/Checkout"
import {Details} from "./pages/Details/Details"
import {Favorites} from "./pages/Favorites/Favorites"
import {Summary} from "./pages/Summary/Summary"
import {React, useState} from 'react'
import { Route, Routes } from "react-router-dom";
import './App.css';
import LoginSuccess from "./components/LoginSuccess/LoginSuccess";


function App() {
  const [cart,setCart] = useState(null)

  return (
    <div className="App">      
      <Header cart={cart} />
        <Routes>
          <Route exact path="/" element={<Home setCart={setCart} />} />
          <Route exact path="/settings" element={<Settings/>} />
          <Route exact path="/signIn" element={<SignIn />} />
          <Route exact path="/cart" element={<Cart setCartParent={setCart} />} />
          <Route exact path="/checkout" element={<Checkout />} />
          <Route exact path="/menu/:id" element={<Details setCart={setCart} />} />
          <Route exact path="/favorites" element={<Favorites />} />
          <Route exact path="/summary" element={<Summary />} />
          <Route exact path="/auth/login-success/:token" element={<LoginSuccess />} />          
        </Routes>
    </div>
  );
}

export default App;
