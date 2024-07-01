import Button from '../components/Button';
import styles from './style_modules/Pagination.module.css';

// 1 2 3 4 5 6 7 8 9                        n <= 9
// 1 2 3 4 5 6 7 ∙∙∙ n-1 n                  i <= 5
// 1 2 ∙∙∙ i-2 i-1 i i+1 i+2 ∙∙∙ n-1 n      5 < i < n-4
// 1 2 ∙∙∙ n-6 n-5 n-4 n-3 n-2 n-1 n        i >= n-4

function Pagination({ currentPage, setCurrentPage, pagesCount }) {
    const getNumPagesArr = () => {
        const arr = [];
        for (let i = 1; i <= pagesCount; i++)
            arr.push(i);
        return arr;
    };

    return (
        currentPage <= 0 ? null : <article className={ styles.root }>
            {
                pagesCount <= 9 ? (
                    <PaginationButtonGroup
                        pages={ getNumPagesArr() }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                ) : currentPage <= 5 ? (<>
                    <PaginationButtonGroup
                        pages={ [1, 2, 3, 4, 5, 6, 7] }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                    <span>∙∙∙</span>
                    <PaginationButtonGroup
                        pages={ [pagesCount - 1, pagesCount] }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                </>) : 5 < currentPage && currentPage < pagesCount - 4 ? (<>
                    <PaginationButtonGroup
                        pages={ [1, 2] }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                    <span>∙∙∙</span>
                    <PaginationButtonGroup
                        pages={ [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2] }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                    <span>∙∙∙</span>
                    <PaginationButtonGroup
                        pages={ [pagesCount - 1, pagesCount] }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                </>) : (<>
                    <PaginationButtonGroup
                        pages={ [1, 2] }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                    <span>∙∙∙</span>
                    <PaginationButtonGroup
                        pages={ [pagesCount - 6, pagesCount - 5, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1, pagesCount] }
                        currentPage={ currentPage }
                        setCurrentPage={ setCurrentPage }
                    />
                </>)
            }
        </article>
    );
}

function PaginationButtonGroup({ pages, currentPage, setCurrentPage }) {
    return pages.map(pageNum =>
        <Button
            key={ pageNum }
            className={ pageNum === currentPage ? 'paginationTrue' : 'paginationFalse' }
            onClick={ () => setCurrentPage(pageNum) }
        >
            { pageNum }
        </Button>
    );
}

export default Pagination;