export interface ICategory {
    name: string;
    slug: string;
    description: string;
    image: string;
    active: boolean;
    softDelete: boolean;
    required: string[];
    position: number;
}
