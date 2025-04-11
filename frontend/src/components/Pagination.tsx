import PageLink from './PageLink';

export type Props = {
    currentPage: number;
    lastPage: number;
    maxLength: number;
    setCurrentPage: (page: number) => void;
};

const pagination = "flex flex-wrap justify-center w-full";

export default function Pagination({
                                       currentPage,
                                       lastPage,
                                       maxLength,
                                       setCurrentPage,
                                   }: Props) {
    // const pageNums = [1, 2, 3];

    const getPageNumbers = () => {
        if (lastPage <= maxLength) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }

        const start = Math.max(1, Math.min(
            currentPage - Math.floor(maxLength / 2),
            lastPage - maxLength + 1
        ));
        const end = Math.min(lastPage, start + maxLength - 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className={pagination} aria-label="Pagination">
            <PageLink
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
            >
                Previous
            </PageLink>

            {!pageNumbers.includes(1) && (
                <>
                    <PageLink
                        active={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                    >
                        1
                    </PageLink>
                    {pageNumbers[0] > 2 && <span className="px-3 py-2">...</span>}
                </>
            )}

            {pageNumbers.map((pageNum) => (
                <PageLink
                    key={pageNum}
                    active={currentPage === pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                >
                    {pageNum}
                </PageLink>
            ))}


            {!pageNumbers.includes(lastPage) && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < lastPage - 1 && (
                        <span className="px-3 py-2">...</span>
                    )}
                    <PageLink
                        active={currentPage === lastPage}
                        onClick={() => setCurrentPage(lastPage)}
                    >
                        {lastPage}
                    </PageLink>
                </>
            )}

            <PageLink
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage(currentPage + 1)}
            >
                Next
            </PageLink>
        </nav>
    );
}