import { createSlice, current } from '@reduxjs/toolkit';

interface ICart {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    quantity: number;
    promotion: number;
}

const initialState: ICart[] = [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            const newData = {
                _id: action.payload._id,
                name: action.payload.name,
                price: action.payload.price,
                slug: action.payload.slug,
                promotion: action.payload.promotion,
                image: action.payload.imageURL[0],
            };

            const itemExists = state.find((item: ICart) => item._id === action.payload._id);

            itemExists ? itemExists.quantity++ : state.push({ ...newData, quantity: 1 });

            window.localStorage.setItem('cart', JSON.stringify(current(state)));
        },
        getCart: (state, action) => {
            state.push(action.payload);
        },
        removeCartItem: (state, action) => {
            let index = state.findIndex((item: ICart) => item._id === action.payload);

            if (index !== -1) {
                state.splice(index, 1);
            }

            const cartStore = window.localStorage.getItem('cart');

            if (cartStore) {
                const data = JSON.parse(cartStore);

                data.splice(index, 1);

                localStorage.setItem('cart', JSON.stringify(data));
            }
        },
        increment: (state, action) => {
            let index = state.findIndex((item: ICart) => item._id === action.payload);
            state[index].quantity += 1;
        },
        decrement: (state, action) => {
            let index = state.findIndex((item: ICart) => item._id === action.payload);
            state[index].quantity <= 1 ? (state[index].quantity = 1) : (state[index].quantity -= 1);
        },
        resetCart: () => {
            window.localStorage.removeItem('cart');
            return initialState;
        },
    },
});

// Action creators are generated for each case reducer function
export const { addToCart, getCart, removeCartItem, increment, decrement, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
