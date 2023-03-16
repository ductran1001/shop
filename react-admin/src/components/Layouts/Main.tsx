import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useLocation } from 'react-router-dom';

type Props = {
    children?: React.ReactNode;
};

export const Main = ({ children }: Props) => {
    const [showSidebar, setShowSidebar] = React.useState(false);
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();
    const isRouteAuth = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="flex flex-col min-h-screen">
            {!user && !isRouteAuth ? (
                <div className="overlay z-[99] opacity-30">
                    <div className="overlay__inner">
                        <div className="overlay__content">
                            <span className="spinner"></span>
                        </div>
                    </div>
                </div>
            ) : null}
            {user && (
                <>
                    <Header showSidebar={showSidebar} handleShowSidebar={() => setShowSidebar((pre) => !pre)} />

                    <div className="flex flex-row h-screen pt-16 overflow-hidden bg-white">
                        <Sidebar showSidebar={showSidebar} handleShowSidebar={() => setShowSidebar((pre) => !pre)} />
                        <main className="relative w-full h-full overflow-y-auto bg-gray-50 md:ml-64">{children}</main>
                    </div>
                </>
            )}

            {!user && (
                <div className="flex flex-row h-screen pt-16 overflow-hidden bg-gray-50">
                    <main className="relative w-full h-full overflow-y-auto bg-gray-50">{children}</main>
                </div>
            )}
        </div>
    );
};
