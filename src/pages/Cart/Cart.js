import MenuItem from "../../components/MenuItem/MenuItem"
import "./Cart.css"
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import { getCart, setItemQtyInCart } from "../../utilities/orders-api"
import Counter from "../../components/Counter/Counter"

export function Cart({ setCartParent }) {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cart = await getCart();
                setCart(cart);
                setCartParent(cart);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCart();
    }, []);

    const handleRemoveItem = async (itemId) => {
        const cart = await setItemQtyInCart(itemId, 0);
        setCart(cart);
        setCartParent(cart);
    }

    const handleAmountChange = async (itemId, newQty)=>{
        const cart = await setItemQtyInCart(itemId, newQty);
        setCart(cart);
        setCartParent(cart);
    }
    return (
        <>
            <h2>Items in Cart</h2>
            <div className='cart-layout'>
                {cart && cart.orderItems && cart.orderItems.map(orderItem => {
                    const item = orderItem.menuItem;
                    return (<>
                        <MenuItem
                            showFavIcon={false}
                            itemImgUrl={item.imageUrl}
                            itemImgAlt={item.imageDescription}
                            itemName={item.name}
                            itemDescription={item.description}
                            itemPrice={item.price}
                            btnText="remove item from cart"
                            btnImg="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNyIgaGVpZ2h0PSIyNyIgdmlld0JveD0iMCAwIDI3IDI3IiBmaWxsPSJub25lIj4KICA8cGF0aCBkPSJNMjIuODc1IDEwLjY0MDZMMjAuNzkxNyAyNi4wMDA3SDYuMjA4MzNMNC4xMjUgMTAuNjQwNiIgc3Ryb2tlPSIjMDAwMDAxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik0xIDYuODA0NjlIMjYiIHN0cm9rZT0iIzAwMDAwMSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICA8cGF0aCBkPSJNOC4yMDgwMSA2LjI0MTYxVjIuOTIwMDFDOC4yMDgwMSAyLjQxMDc5IDguNDI3NSAxLjkyMjQzIDguODE4MiAxLjU2MjM2QzkuMjA4OSAxLjIwMjI5IDkuNzM4ODEgMSAxMC4yOTEzIDFIMTYuNTQxM0MxNy4wOTM5IDEgMTcuNjIzOCAxLjIwMjI5IDE4LjAxNDUgMS41NjIzNkMxOC40MDUyIDEuOTIyNDMgMTguNjI0NyAyLjQxMDc5IDE4LjYyNDcgMi45MjAwMVY2Ljc2MDAyIiBzdHJva2U9IiMwMDAwMDEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg=="
                            itemId={item._id}
                            tabindex={1}
                            onClick={handleRemoveItem} />
                        <Counter initNum={orderItem.quantity} onChange={(qty)=>handleAmountChange(item._id,qty)} />
                    </>);
                })}
            </div>
            <br />
            <br />
            <div className="buttons">
                <Link to='/checkout'><button className="cart-btn">Checkout</button></Link>
                <br />
                <br />
                <Link to='/'><button className="cart-btn">Add More Items</button></Link>
            </div>
        </>
    )
}
