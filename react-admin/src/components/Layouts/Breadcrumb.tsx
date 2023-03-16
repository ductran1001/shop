import { Link } from 'react-router-dom';

interface IProps {
    page?: string;
    sub?: string;
}

export const Breadcrumb: React.FC<IProps> = ({ page, sub }) => {
    return (
        <nav className="flex uppercase">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center font-medium text-gray-700 hover:text-blue-600"
                    >
                        <img src="/icon/Home.png" alt="" className="w-6 h-6 mr-2 bg-white" />
                        Dashboard
                    </Link>
                </li>
                <li className="inline-flex items-center">
                    <Link
                        to={`/${page}`}
                        className="inline-flex items-center font-medium text-gray-700 hover:text-blue-600"
                    >
                        <img src="/icon/arrow.png" className="w-6 h-6 mr-2" alt="" />
                        {page}
                    </Link>
                </li>
                {sub && (
                    <li>
                        <div className="flex items-center">
                            <img src="/icon/arrow.png" className="w-6 h-6 mr-2" alt="" />
                            <span className="font-medium text-gray-500">{sub}</span>
                        </div>
                    </li>
                )}
            </ol>
        </nav>
    );
};
