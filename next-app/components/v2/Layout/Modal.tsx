import React from 'react';
import { FaUser } from 'react-icons/fa';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { axiosClient } from '@/lib/axiosClient';
import { useDispatch } from 'react-redux';
import { getUserApi } from '@/apis/auth.api';

interface Props {
    onClick: () => void;
    typeModal: string;
    setTypeModal: React.Dispatch<React.SetStateAction<string>>;
}

interface IForm {
    email: string;
    password: string;
}

const mySchema = object().shape({
    email: string().required('Email là trường bắt buộc').email('Email không hợp lệ'),
    password: string()
        .min(6, `Mật khẩu phải có ít nhất 6 ký tự`)
        .max(40, `Mật khẩu không được vượt quá 40 ký tự`)
        .required(`Mật khẩu là trường bắt buộc`),
});

export const Modal = ({ onClick, typeModal, setTypeModal }: Props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<IForm>({
        resolver: yupResolver(mySchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: IForm) => {
        setLoading(true);
        try {
            const response =
                typeModal === 'register'
                    ? await axiosClient.post('/api/auth/register-home', data)
                    : await axiosClient.post('/api/auth/login', data);
            if (response.status === 200 || response.status === 201) {
                toast.success('Success');
                setLoading(false);
                reset();
                if (typeModal === 'register') {
                    setTypeModal('login');
                } else {
                    getUserApi(dispatch);
                    onClick();
                }
            }
        } catch (error) {
            setLoading(false);
            toast.error('Invalid Email Or Password');
        }
    };
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {loading && (
                <div className="overlay z-[99] opacity-30">
                    <div className="overlay__inner">
                        <div className="overlay__content">
                            <span className="spinner"></span>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={onClick}></div>
            <form className="flex items-center min-h-screen px-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative w-full max-w-sm px-4 pt-8 pb-4 mx-auto bg-white rounded-md shadow-lg">
                    <div className="absolute top-0 left-0 flex justify-center w-full p-3 -mt-12">
                        <FaUser className="w-16 h-16 p-2 text-gray-700 bg-white border border-gray-300 rounded-full" />
                    </div>

                    <div className="my-2.5 px-4 text-center flex gap-4 flex-col">
                        <h4 className="mb-4 text-lg font-medium text-gray-900 uppercase">
                            {typeModal === 'register' ? 'Đăng ký' : 'Đăng nhập'} Tài Khoản
                        </h4>
                        <div className="flex flex-col mb-2.5 gap-1">
                            <input
                                {...register('email')}
                                type="email"
                                name="email"
                                className="py-2.5 px-2.5 border border-gray-300 focus:outline-none text-gray-900 text-sm"
                                placeholder="Địa chỉ Email"
                            />
                            {errors?.email && <ErrMess message={errors.email.message as string} />}
                        </div>

                        <div className="flex flex-col mb-2.5 gap-1">
                            <input
                                {...register('password')}
                                type="password"
                                name="password"
                                className="py-2.5 px-2.5 border border-gray-300 focus:outline-none text-gray-900 text-sm"
                                placeholder="Mật Khẩu"
                            />
                            {errors?.password && <ErrMess message={errors.password.message as string} />}
                        </div>

                        <button
                            disabled={!isValid}
                            className={`${
                                !isValid ? 'opacity-70 cursor-not-allowed' : ''
                            } uppercase w-full p-2.5 flex-1 flex items-center gap-2 justify-center text-white bg-primary`}
                        >
                            <span>{typeModal === 'register' ? 'Đăng ký' : 'Đăng nhập'}</span>
                        </button>
                        <div className="flex items-center gap-1 m-auto text-xs">
                            {typeModal === 'register' ? (
                                <>
                                    <span className="text-gray-900">Bạn đã có một Tài khoản?</span>
                                    <span className="cursor-pointer text-primary" onClick={() => setTypeModal('login')}>
                                        Đăng nhập tại đây.
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-900">Bạn chưa có Tài khoản?</span>
                                    <span
                                        className="cursor-pointer text-primary"
                                        onClick={() => setTypeModal('register')}
                                    >
                                        Đăng ký tại đây.
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
const ErrMess = ({ message }: { message: string }) => (
    <p className="w-full text-xs italic text-red-600 capitalize text-start">{message}</p>
);
