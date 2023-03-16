/* eslint-disable @next/next/no-img-element */
import { axiosClient } from '@/lib/axiosClient';
import { updateUser } from '@/redux/slice/authSlice';
import { RootState } from '@/redux/store';
import { IUser } from '@/types';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export const MainAcc = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [userState, setUserState] = React.useState(user);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();

    React.useEffect(() => {
        user && setUserState(user);
    }, [user]);

    const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const headers = { 'Content-type': 'multipart/form-data' };

        if (files) {
            const formData = new FormData();
            formData.append('images', files[0]);
            setLoading(true);
            try {
                const response = await axiosClient.post(`/api/upload-cloud/user`, formData, {
                    headers,
                });
                setUserState((prev: any) => ({ ...prev, avatar: response.data?.results[0] }));
                setLoading(false);

                toast.success('Upload thành công');
            } catch (error) {
                setLoading(false);

                toast.error('Something went wrong!');
            }
        }
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setUserState((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }));
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        var pattern = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);

        if (
            !pattern.test(userState?.phoneNumber as string) ||
            (userState as IUser).fullName === '' ||
            (userState as IUser).address === ''
        ) {
            toast.error('Please enter a valid input!');
        } else {
            try {
                const response = await axiosClient.patch(`/api/user/${userState?._id as string}`, userState);

                if (response.status === 200) {
                    toast.success('Cập nhập thành công');
                    dispatch(updateUser(response.data.contents));
                }
            } catch (error) {
                toast.error('Something went wrong!');
            }
        }
    };

    return (
        <div className="md:w-5/6 w-full bg-white shadow-md">
            {loading && (
                <div className="overlay z-[99] opacity-30">
                    <div className="overlay__inner">
                        <div className="overlay__content">
                            <span className="spinner"></span>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-8 py-4">
                <div className="flex flex-col border-b border-gray-300">
                    <span className="text-lg">Hồ Sơ Của Tôi</span>
                    <span className="my-2 text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
                </div>
            </div>
            <div className="flex md:flex-row flex-col pb-4 pt-2.5 px-8 gap-4">
                <div className="md:w-[60%] w-full md:order-1 order-2">
                    <form className="flex flex-col gap-8 px-4 pb-6" onSubmit={(event) => onSubmit(event)}>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">tên</label>
                            <input
                                defaultValue={userState?.fullName}
                                onChange={(event) => handleInputChange(event)}
                                name="fullName"
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">email</label>
                            <input
                                readOnly
                                defaultValue={userState?.email}
                                onChange={(event) => handleInputChange(event)}
                                name="email"
                                className="flex-1 bg-gray-200 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="email"
                            />
                        </div>
                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">số điện thoại</label>
                            <input
                                defaultValue={userState?.phoneNumber}
                                onChange={(event) => handleInputChange(event)}
                                name="phoneNumber"
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>

                        <div className="flex items-center gap-2.5">
                            <label className="text-sm text-gray-600 w-28">địa chỉ </label>
                            <input
                                defaultValue={userState?.address}
                                onChange={(event) => handleInputChange(event)}
                                name="address"
                                className="flex-1 border border-gray-300 focus:outline-none py-2 px-2.5 text-gray-800"
                                type="text"
                            />
                        </div>

                        <button className="px-2.5 py-2 bg-primary text-white text-center ml-[122px]">Lưu</button>
                    </form>
                </div>
                <div className="w-full md:w-[40%] md:border-l border-none border-gray-300">
                    <div className="flex flex-col items-center gap-4 px-4 mx-auto">
                        <div className="w-24 h-24 p-4 border border-gray-300 rounded-full">
                            <img src={userState?.avatar} alt="" />
                        </div>
                        <label className="px-6 py-2 text-sm capitalize border border-gray-300 cursor-pointer">
                            <input onChange={(event) => uploadPhoto(event)} type="file" className="hidden" />
                            chọn ảnh
                        </label>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-gray-400">Dụng lượng file tối đa 1 MB</span>
                            <span className="text-sm text-gray-400">Định dạng:.JPEG, .PNG</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
