import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";

function CartPage() {
    const navigate = useNavigate();
    const {cart, removeFromCart} = useCart();
    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
        <>
            <div>
                <h2>Your Cart</h2>
                <div>
                    {cart.length === 0 ? (
                    <p>Your cart is empty</p> ) : (
                    <ul>
                        {cart.map((item: CartItem) => (
                            <li key={item.bookID}>
                                {item.title} (quantity {item.quantity}): ${item.price.toFixed(2)} per = ${(item.quantity * item.price).toFixed(2)} total
                                <button onClick={() => removeFromCart(item.bookID)}>Remove</button>
                            </li>))}
                    </ul>
                    )}
                </div>
                <h3>Grand Total: ${(total).toFixed(2)} </h3>
                <button className="btn btn-success">Checkout</button>
                <button className="btn btn-primary" onClick={() => navigate("/books")}>Continue Shopping</button>
            </div>
        </>
    );
}

export default CartPage