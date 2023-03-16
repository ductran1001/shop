import * as Yup from 'yup';

const fullName = Yup.string().required().min(6);
const email = Yup.string().required().email();

const passwordValidator = (field: string) =>
    Yup.string()
        .required(`${field} is required`)
        .min(6, `${field} must be at least 6 characters`)
        .max(40, `${field} must not exceed 40 characters`);

export const registerSchema = Yup.object({
    body: Yup.object({
        fullName,
        email,
        password: passwordValidator('Password'),
    }),
});

export const registerHomeSchema = Yup.object({
    body: Yup.object({
        email,
        password: passwordValidator('Password'),
    }),
});

export const loginSchema = Yup.object({
    body: Yup.object({
        email,
        password: passwordValidator('Password'),
    }),
});
