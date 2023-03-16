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

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    description: string;
    active: boolean;
    image: string;
    photos: string[];
    position: string;
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

export interface ISlider {
    _id: string;
    photo: string;
}

export interface IProductGroup {
    _id: string;
    name: string;
    products: IProduct[];
    count: number;
}
export interface IProductFilter {
    status: string;
    results: number;
    pages: number;
    contents: IProduct[];
}

export interface IOrder {
    _id: string;
    user: IUser;
    orderDetails: IOrderDetails[];
}

export interface IOrderDetails {
    _id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    slug: string;
    quantity: number;
    color: string;
    promotion: number;
    status: string;
}

export interface IProductsFilter {
    status: string;
    totalPages: number;
    count: number;
    currentPage: number;
    results: IProduct[];
}
