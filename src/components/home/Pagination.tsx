import * as React from "react";
import { Button } from "@/components/ui/button";
import {MoveLeftIcon, MoveRightIcon} from "lucide-react"

interface PaginationProps {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    page,
    pageCount,
    onPageChange,
    className = "",
}) => {
    const [isMobileScreen, setIsMobileScreen] = React.useState<boolean>(false)
    const canPrevious = page > 1;
    const canNext = page < pageCount;

    const handlePrevious = () => {
        if (canPrevious) onPageChange(page - 1);
    };

    const handleNext = () => {
        if (canNext) onPageChange(page + 1);
    };

    // Helper to generate page numbers (simple version, shows all pages)
    const getPageNumbers = () => {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    };

    const handleResize = () => {
        setIsMobileScreen(window.innerWidth <= 500 ? true : false)

        console.log("jitendra",window.innerWidth)

    }

    React.useEffect(()=>{
        handleResize()
        window.addEventListener("resize",handleResize);
        
        return () => {
            window.removeEventListener("resize",handleResize)
        }
    },[])

    return (
        <nav className={`flex items-center gap-2 ${className}`}>
            <Button className="text-cyprus" variant="outline" size="sm" onClick={handlePrevious} disabled={!canPrevious}>
                {isMobileScreen ? <MoveLeftIcon size={16} /> : "Previous"}
            </Button>
            <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        variant={pageNumber === page ? "outline" : "outline"}
                        size="sm"
                        // className={`${pageNumber === page ? "bg-[#000000] text-white hover:bg-[#0f172a] hover:text-white" : ""} text-cyprus`}
                        onClick={() => onPageChange(pageNumber)}
                        disabled={pageNumber === page}
                    >
                        {pageNumber}
                    </Button>
                ))}
            </div>
            <Button className="text-cyprus" variant="outline" size="sm" onClick={handleNext} disabled={!canNext}>
                {isMobileScreen ? <MoveRightIcon size={16} /> : "Next"}
            </Button>
        </nav>
    );
};

export default Pagination;