// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import RestaurantMock from './pages/RestaurantMock';
import OrderPage from './pages/OrderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/menu/:restaurantId" element={<Menu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/restaurant/:id" element={<RestaurantMock />} />
        <Route path="*" element={<Home />} />
        <Route path="/order/:restaurantId" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
