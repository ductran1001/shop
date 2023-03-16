import * as Yup from 'yup';

const phoneNumberValidator = Yup.string().matches(/^\d{3}\d{3}\d{4}$/, 'Phone number is not valid');

const passwordValidator = (field: string) =>
    Yup.string()
        .min(6, `${field} must be at least 6 characters`)
        .max(40, `${field} must not exceed 40 characters`)
        .required(`${field} is required`);

const fullName = Yup.string().required().min(6).trim();

const email = Yup.string().required().email();

const name = Yup.string().required();

const title = Yup.string().required();

const code = Yup.string().required();

const address = Yup.string().required();

// const price = Yup.number().typeError('Price must be a number!').required().min(1);

// const quantity = Yup.number().typeError('quantity must be a number!').required().min(1);

// const promotion = Yup.number().typeError('promotion must be a number!').required().min(0);

const description = Yup.string().required();

const position = Yup.number().typeError('position must be a number!').required().min(1);

export const createCategorySchema = Yup.object().shape({ name, description, position });

export const createColorSchema = Yup.object().shape({ title, code });

export const createBrandSchema = Yup.object().shape({ title });
export const createUserSchema = Yup.object().shape({
    password: passwordValidator('Password'),
    confirm: passwordValidator('Confirm Password').oneOf([Yup.ref('password')], "Passwords don't match"),
    fullName,
    email,
    phoneNumber: phoneNumberValidator,
    address,
});

export const updateUserInfoSchema = Yup.object().shape({
    fullName,
    email,
    phoneNumber: phoneNumberValidator,
    address,
});

export const updateUserPasswordSchema = Yup.object().shape({
    password: passwordValidator('Password'),
    newPass: passwordValidator('New Password'),
    confirm: passwordValidator('Confirm Password').oneOf([Yup.ref('newPass')], 'Confirm Passwords must match'),
});

export const registerSchema = Yup.object().shape({
    fullName,
    email,
    password: passwordValidator('Password'),
});

export const loginSchema = Yup.object().shape({
    email,
    password: passwordValidator('Password'),
});

export const productSchema = Yup.object().shape({ name, description });

export const productBasicSchema = Yup.object().shape({ name, description });
