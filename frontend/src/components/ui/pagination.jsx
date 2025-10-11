import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@/lib/utils';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    onPageSizeChange,
    className = "",
    showInfo = true,
    showPageSize = true,
    totalItems = 0,
    itemsPerPage = 12,
    pageSizeOptions = [10, 20, 50, 100],
    itemLabel = "items",
    theme = "light"
}) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    const buttonVariant = theme === 'dark' ? 'outline' : 'outline';
    const buttonClass = theme === 'dark' 
        ? 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600' 
        : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50';

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 p-4", className)}>
            {/* Pagination Info */}
            {showInfo && (
                <div className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                    Showing <span className={`font-medium ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>{startItem}</span> to{' '}
                    <span className={`font-medium ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>{endItem}</span> of{' '}
                    <span className={`font-medium ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                    }`}>{totalItems}</span> {itemLabel}
                </div>
            )}

            {/* Page Size Selector */}
            {showPageSize && (
                <div className="flex items-center space-x-2">
                    <span className={`text-sm ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                        Show:
                    </span>
                    <Select 
                        value={itemsPerPage.toString()} 
                        onValueChange={(value) => onPageSizeChange && onPageSizeChange(parseInt(value))}
                    >
                        <SelectTrigger className={`w-20 h-9 ${
                            theme === 'dark' 
                                ? 'bg-slate-700 border-slate-600 text-slate-200' 
                                : 'bg-white border-slate-300 text-slate-800'
                        }`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'}>
                            {pageSizeOptions.map((size) => (
                                <SelectItem 
                                    key={size} 
                                    value={size.toString()}
                                    className={theme === 'dark' ? 'text-slate-200 hover:bg-slate-600' : 'text-slate-800 hover:bg-slate-100'}
                                >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
                {/* First Page Button */}
                <Button
                    variant={buttonVariant}
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={`h-9 w-9 p-0 ${buttonClass}`}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Button */}
                <Button
                    variant={buttonVariant}
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`h-9 w-9 p-0 ${buttonClass}`}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                {visiblePages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <Button
                                variant={buttonVariant}
                                size="sm"
                                disabled
                                className={`h-9 w-9 p-0 ${buttonClass}`}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                variant={currentPage === page ? "default" : buttonVariant}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className={`h-9 w-9 p-0 ${
                                    currentPage === page 
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                        : buttonClass
                                }`}
                            >
                                {page}
                            </Button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next Button */}
                <Button
                    variant={buttonVariant}
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`h-9 w-9 p-0 ${buttonClass}`}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page Button */}
                <Button
                    variant={buttonVariant}
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`h-9 w-9 p-0 ${buttonClass}`}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
