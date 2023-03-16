export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    avatar: string;
    address: string;
    role: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAuth {
    user?: IUser | null;
}

export interface IError {
    message: string;
}

export interface ICategory {
    _id: string;
    name: string;
    image: string;
    slug: string;
    position: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IColor {
    _id: string;
    title: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface IBrand {
    _id: string;
    title: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface IProduct {
    _id: string;
    name: string;
    slug: string;
    description: string;
    user: IUser;
    category: ICategory;
    imageURL: string[];
    active: boolean;
    softDelete: boolean;
    variant: IVariant[];
    sold: number;
    // sold: number;
}
interface IVariant {
    id?: string;
    color: string;
    price: number | string;
    promotion: number | string;
    quantity: number | string;
}

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
    status: string;
    _id: string;
    promotion: number;
}
