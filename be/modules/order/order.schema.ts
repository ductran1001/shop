import * as Yup from 'yup';
export const createOrderSchema = Yup.object({
    body: Yup.object({
        firstName: Yup.string().required(),
        name: Yup.string().required(),
        city: Yup.string().required(),
        address: Yup.string().required(),
        phoneNumber: Yup.string().matches(/^\d{3}\d{3}\d{4}$/, 'phoneNumber is invalid'),
        email: Yup.string().required().email(),
        orderDetails: Yup.array().required(),
    }),
});
