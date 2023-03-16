import * as Yup from 'yup';
export const colorSchema = Yup.object({
    body: Yup.object({
        title: Yup.string().required(),
        code: Yup.string().required(),
    }),
});
