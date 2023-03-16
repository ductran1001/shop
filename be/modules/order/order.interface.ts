import { IUser } from '../user/user.interface';

export interface IOrder {
    _id: string;
    user: IUser;
    orderDetails: IOrderDetails[];
}

export interface IOrderDetails {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    promotion: number;
}
