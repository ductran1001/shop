import * as Yup from 'yup';
export const brandSchema = Yup.object({
    body: Yup.object({
        title: Yup.string().required(),
    }),
});
