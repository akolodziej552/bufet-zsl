import "../styles/pages/menu.css";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaClock, FaCheckCircle } from "react-icons/fa";

const products = [
    {id: 1, name: "Hot Dog z dodatkami", price: 7, emoji: "🌭"},
    {id: 2, name: "Hot Dog bez dodatków", price: 6, emoji: "🌭"},
    {id: 3, name: "Zapiekanka z pieczarkami", price: 8, emoji: "🍄🥖"},
    {id: 4, name: "Zapiekanka z szynką", price: 9, emoji: "🥖🍖"},
    {id: 5, name: "Zapiekanka z salami", price: 9, emoji: "🥖🍕"},
    {id: 6, name: "Zapiekanka z kurczakiem", price: 9, emoji: "🥖🍗"},
    {id: 7, name: "Buła z gyrosem", price: 16, emoji: "🥙"},
    {id: 8, name: "Wrap z kurczaka", price: 16, emoji: "🌯"},
    {id: 9, name: "Panini z salami", price: 8, emoji: "🥪"},
    {id: 10, name: "Panini z kurczakiem", price: 8, emoji: "🥪🍗"},
    {id: 11, name: "Drożdżówka (dżem, budyń)", price: 4.50, emoji: "🧁"},
    {id: 12, name: "Drożdżówka paluch", price: 5, emoji: "🥐"},
    {id: 13, name: "Drożdżówka", price: 4, emoji: "🥐"},
    {id: 14, name: "Obwarzanek", price: 3, emoji: "🥨"},
    {id: 15, name: "Kanapka mix", price: 7, emoji: "🥪"},
    {id: 16, name: "Gorąca czekolada", price: 6.50, emoji: "🍫☕"},
    {id: 17, name: "Kawa czarna", price: 6.50, emoji: "☕"},
    {id: 18, name: "Kawa biała", price: 7, emoji: "☕🥛"},
    {id: 19, name: "Herbata", price: 4, emoji: "🍵"},
    {id: 20, name: "Tosty (2 szt.)", price: 9, emoji: "🍞"},
    {id: 21, name: "Herbata zimowa", price: 7, emoji: "🍵🍊"}
];

const Menu = () => {
    const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useContext(CartContext);
    const [pickupTime, setPickupTime] = useState("");
    const [ordered, setOrdered] = useState(false);
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
            alert("Musisz być zalogowany, aby złożyć zamówienie!");
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
            status: "Nowe",
        };

        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));

        setOrdered(true);
        clearCart();
        setPickupTime("");
        setTimeout(() => setOrdered(false), 4000);
    };

    const getQuantity = (id) => {
        const item = cart.find((i) => i.id === id);
        return item ? item.quantity : 0;
    };

    return (
        <div className="menu-page">
            <div className="menu-layout">
                <section className="menu-products">
                    <h1 className="menu-title">Menu</h1>
                    <div className="products-grid">
                        {products.map((product) => {
                            const qty = getQuantity(product.id);
                            return (
                                <div key={product.id} className="product-card">
                                    <span className="product-emoji">{product.emoji}</span>
                                    <div className="product-info">
                                        <span className="product-name">{product.name}</span>
                                        <span className="product-price">{fmt(product.price)}</span>
                                    </div>
                                    <div className="product-controls">
                                        {qty > 0 ? (
                                            <>
                                                <button className="qty-btn" onClick={() => removeFromCart(product.id)}>−</button>
                                                <span className="qty-count">{qty}</span>
                                                <button className="qty-btn" onClick={() => addToCart(product)}>+</button>
                                            </>
                                        ) : (
                                            <button className="add-btn" onClick={() => addToCart(product)}>Dodaj</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
                <aside className="cart-panel">
                    <h2 className="cart-title"><FaShoppingCart style={{ marginRight: "6px" }}/> Koszyk</h2>

                    {cart.length === 0 ? (
                        <p className="cart-empty">Koszyk jest pusty</p>
                    ) : (
                        <>
                            <ul className="cart-list">
                                {cart.map((item) => (
                                    <li key={item.id} className="cart-item">
                                        <span className="cart-item-name">{item.name}</span>
                                        <div className="cart-item-controls">
                                            <button className="qty-btn small" onClick={() => removeFromCart(item.id)}>−</button>
                                            <span className="qty-count">{item.quantity}</span>
                                            <button className="qty-btn small" onClick={() => addToCart(item)}>+</button>
                                        </div>
                                        <span className="cart-item-price">{fmt(item.price * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="cart-total">
                                <span>Suma:</span>
                                <strong>{fmt(totalPrice)}</strong>
                            </div>

                            <div className="cart-pickup">
                                <label htmlFor="pickup-time"><FaClock style={{ marginRight: "6px" }}/> Godzina odbioru:</label>
                                <input
                                    id="pickup-time"
                                    type="time"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                />
                            </div>

                            <button className="order-btn" onClick={handleOrder}>
                                Złóż zamówienie
                            </button>
                            <button className="clear-btn" onClick={clearCart}>
                                Wyczyść koszyk
                            </button>
                        </>
                    )}

                    {ordered && (
                        <div className="order-success">
                            <FaCheckCircle style={{ marginRight: "6px" }}/> Zamówienie złożone!
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default Menu;
