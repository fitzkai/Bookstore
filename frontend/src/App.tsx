import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import BooksPage from './pages/BooksPage'
import CartPage from './pages/CartPage'
import PurchasePage from './pages/PurchasePage';
import { CartProvider } from './context/CartContext'


function App() {

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path='/' element={<BooksPage/>} />
            <Route path='/books' element={<BooksPage/>} />
            <Route path='/cart' element={<CartPage/>} />
            <Route path='/buy/:title/:bookID/:price' element={<PurchasePage/>} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  )
}

export default App
