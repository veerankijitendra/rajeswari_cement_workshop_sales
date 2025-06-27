import * as React from "react";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import useResize from "@/hooks/useResize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const isMobileScreen = useResize();
  const canPrevious = page > 1;
  const canNext = page < pageCount;

  const handlePrevious = () => {
    if (canPrevious) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (canNext) onPageChange(page + 1);
  };

  const getPageNumbers = () => {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  };

  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            className="text-cyprus"
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canPrevious}
          >
            {isMobileScreen ? <MoveLeftIcon size={16} /> : "Previous"}
          </Button>
        </TooltipTrigger>
        <TooltipContent> Previous</TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === page ? "outline" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            disabled={pageNumber === page}
          >
            {pageNumber}
          </Button>
        ))}
      </div>
      <Tooltip>
        <TooltipTrigger>
          <Button
            className="text-cyprus"
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canNext}
          >
            {isMobileScreen ? <MoveRightIcon size={16} /> : "Next"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Next</TooltipContent>
      </Tooltip>
    </nav>
  );
};

export default Pagination;
