import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import {useCart} from '../context/CartContext'
import { useState } from "react";
import { CartItem } from "../types/CartItem";

function PurchasePage ()
{
    const navigate = useNavigate();
    const {title, bookID: bookIdStr, price: priceStr} = useParams();
    const bookID = Number(bookIdStr);
    const price = Number(priceStr);
    const { cart, addToCart } = useCart();
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const handleAddToCart = () => {
        setLoading(true);
        
        const existingItem = cart.find(
            (item: CartItem) => item.bookID === bookID
        );

        const newItem: CartItem = {
            bookID: bookID,
            title: title || "No Book Found",
            price: price,
            quantity: existingItem ? existingItem.quantity + 1 : 1,
        };

        setTimeout(() => {
            setQuantity(quantity);
            addToCart(newItem);
            setLoading(false);
            setShowAlert(true);

            setTimeout(() => {
                navigate(`/cart`);
            }, 2250);
            
            }, 1500);

    };

    return (
        <>
            <WelcomeBand />
            <h2>Buy {title}</h2>

            {showAlert && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> Book has been added to the cart.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setShowAlert(false)}></button>
                </div>
            )}

            <button
                className={`btn ${loading ? 'btn-primary' : 'btn-success'}`}
                onClick={handleAddToCart}
                disabled={loading} // Disable the button while loading
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" /> Loading...
                    </>
                ) : (
                    "Add to Cart"
                )}
            </button>

            <button className="btn btn-danger" onClick={() => navigate(-1)}>Cancel</button>
        </>
    );
};

export default PurchasePage;