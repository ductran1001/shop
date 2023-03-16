import React from 'react';
import { getUserApi } from 'api';
import { RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Page from 'pages';

const IsRedirect = () => {
    const dispatch = useDispatch();
    const token = window.localStorage.getItem('token');
    const refreshToken = window.localStorage.getItem('refreshToken');

    React.useEffect(() => {
        if (token && refreshToken) getUserApi(dispatch);
        if (!token || !refreshToken) window.localStorage.clear();
    }, [token, refreshToken, dispatch]);

    const { user } = useSelector((state: RootState) => state.auth);

    const isRedirect = !user && !refreshToken && !token;

    return isRedirect;
};

const PrivateRoutes = () => {
    const isRedirect = IsRedirect();

    return isRedirect ? <Navigate to="/login" replace /> : <Outlet />;
};

const PrivateRoutesAdmin = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (user) {
        const isRedirect = Boolean(user.role === 'admin');

        return isRedirect ? (
            <Outlet />
        ) : (
            (toast.error('You are not an administrator'), (<Navigate to="/dashboard" replace />))
        );
    } else {
        return <Outlet />;
    }
};

export const routes = [
    {
        path: '/login',
        element: <Page.Login />,
    },
    {
        path: '/register',
        element: <Page.Register />,
    },
    {
        element: <PrivateRoutes />,
        children: [
            { path: '/dashboard', element: <Page.Dashboard /> },
            { path: '/', element: <Page.Dashboard /> },
            {
                element: <PrivateRoutesAdmin />,
                children: [
                    { path: '/users', element: <Page.ListUser /> },
                    { path: '/users/create', element: <Page.CreateUser /> },
                    { path: '/users/update/:id', element: <Page.UpdateUser /> },
                    { path: '/users/updatePassword/:id', element: <Page.UpdatePassword /> },
                ],
            },

            { path: '/categories', element: <Page.ListCategory /> },
            { path: '/categories/trash', element: <Page.ListCategory /> },
            { path: '/categories/create', element: <Page.CreateCategory /> },
            { path: '/categories/update/:id', element: <Page.UpdateCategory /> },

            // { path: '/colors', element: <Page.ListColor /> },
            // { path: '/colors/create', element: <Page.CreateColor /> },
            // { path: '/colors/update/:id', element: <Page.UpdateColor /> },

            // { path: '/brands', element: <Page.ListBrand /> },
            // { path: '/brands/create', element: <Page.CreateBrand /> },
            // { path: '/brands/update/:id', element: <Page.UpdateBrand /> },

            { path: '/sliders', element: <Page.ListSlider /> },

            { path: '/orders', element: <Page.ListOrder /> },
            { path: '/orders/create', element: <Page.CreateOrder /> },
            { path: '/orders/update/:id', element: <Page.UpdateOrder /> },

            { path: '/products', element: <Page.ListProduct /> },
            { path: '/products/trash', element: <Page.ListProduct /> },
            { path: '/products/create', element: <Page.CreateProduct /> },
            { path: '/products/update/:id', element: <Page.UpdateProduct /> },
        ],
    },
    { path: '*', element: <Page.NotFound /> },
];
