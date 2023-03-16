import ReactPaginate from 'react-paginate';
import { NavigateFunction } from 'react-router-dom';

interface IPagination {
    totalPages: number;
    currentPage: number;
    navigator: NavigateFunction;
    search?: string;
}

export const Paginator: React.FC<IPagination> = ({ totalPages, currentPage, navigator, search }) => {
    const getQuery = search?.replace(`?page=${currentPage}`, '');

    const handlePageClick = (event: { selected: number }) =>
        navigator(getQuery ? `?page=${event.selected + 1}${getQuery}` : `?page=${event.selected + 1}`);

    return (
        <div className="py-8">
            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                forcePage={currentPage - 1}
                hrefBuilder={(page, pageCount) => (page >= 1 && page <= pageCount ? `?page=${page}` : '#')}
                hrefAllControls
            />
        </div>
    );
};
