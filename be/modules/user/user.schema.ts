import * as Yup from 'yup';
export const userSchema = Yup.object({
    body: Yup.object({
        fullName: Yup.string().min(6).required(),
    }),
});
