import * as Yup from 'yup';
export const createCategorySchema = Yup.object({
    body: Yup.object({
        name: Yup.string().min(3).required(),
        description: Yup.string().required(),
        image: Yup.string().required(),
        photos: Yup.array().of(Yup.string()).min(1),
    }),
});
