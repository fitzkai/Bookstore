import { createContext, ReactNode, useContext, useState } from "react";
import { CartItem } from "../types/CartItem";

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (projectId: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined); 