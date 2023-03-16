export interface IProduct {
    name: string;
    slug: string;
    description: string;
    user: string;
    category: string;
    imageURL: string[];
    active: boolean;
    softDelete: boolean;
    price: number;
    variant: object[];
    // sold: number;
}
