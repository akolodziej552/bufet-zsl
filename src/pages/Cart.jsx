import "../styles/pages/cart.css";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaClock, FaCheckCircle } from "react-icons/fa";

const Cart = () => {
    const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useContext(CartContext);
    const [pickupTime, setPickupTime] = useState("");
    const [ordered, setOrdered] = useState(false);
    const navigate = useNavigate();
    const fmt = (price) => price.toFixed(2).replace(".", ",") + " zł";

    const generateOrderNumber = () => {
        let counter = localStorage.getItem("orderCounter");
        counter = counter ? parseInt(counter) + 1 : 1;
        localStorage.setItem("orderCounter", counter);
        return `ZAM-${String(counter).padStart(4, "0")}`;
    };

    const handleOrder = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));
        if (!currentUser) {
            alert("Musisz być zalogowany!");
            return;
        }
        if (cart.length === 0) return;
        if (!pickupTime) {
            alert("Wybierz godzinę odbioru!");
            return;
        }
        const orderNumber = generateOrderNumber();
        const newOrder = {
            userId: currentUser.id,
            number: orderNumber,
            items: cart,
            total: totalPrice,
            pickupTime,
            date: new Date().toLocaleString(),
            status: "Nowe"
        };

        const existing = JSON.parse(localStorage.getItem("orders")) || [];
        localStorage.setItem("orders", JSON.stringify([...existing, newOrder]));
        setOrdered(true);
        clearCart();
        setPickupTime("");
        setTimeout(() => navigate("/orders"), 2000);
    }

    if (ordered) {
        return (
            <div className="cart-page">
                <div className="cart-success">
                    <span><FaCheckCircle style={{ marginRight: "6px" }}/></span>
                    <h2>Zamówienie złożone!</h2>
                    <p>Przekierowanie do historii zamówień...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="cart-title">Koszyk</h1>
            {cart.length === 0 ? (
                <div className="cart-empty-state">
                    <span><FaShoppingCart /></span>
                    <p>Koszyk jest pusty</p>
                    <button className="btn-primary" onClick={() => navigate("/menu")}>Przejdź do menu
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items-section">
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Produkt</th>
                                    <th>Cena</th>
                                    <th>Ilość</th>
                                    <th>Suma</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{fmt(item.price)}</td>
                                        <td>
                                            <div className="qty-controls">
                                                <button onClick={() => removeFromCart(item.id)}>
                                                    -
                                                </button>
                                                <span>
                                                    {item.quantity}
                                                </span>
                                                <button onClick={() => addToCart(item)}>
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {fmt(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn-ghost" onClick={clearCart}>
                            Wyczyść koszyk
                        </button>
                    </div>
                    <div className="cart-summary">
                        <h2>Podsumowanie</h2>
                        <div className="summary-row">
                            <span>Produkty ({cart.reduce((s,i) => s+i.quantity, 0)}):</span>
                            <strong>{fmt(totalPrice)}</strong>
                        </div>
                        <div className="summary-row summary-total">
                            <span>Do zapłaty:</span>
                            <strong>{fmt(totalPrice)}</strong>
                        </div>
                        <div className="pickup-section">
                            <label htmlFor="pickup">
                                <FaClock style={{ marginRight: "6px" }}/> Godzina odbioru:
                            </label>
                            <input id="pickup" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}/>
                        </div>
                        <button className="btn-primary btn-full" onClick={handleOrder}>
                            Złóż zamówienie
                        </button>
                        <button className="btn-ghost btn-full" onClick={() => navigate("/menu")}>
                            ← Wróć do menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;