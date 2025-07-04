import * as React from "react";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import useResize from "@/hooks/useResize";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper to generate page numbers with dots if needed
function getPaginationRange(page: number, pageCount: number): (number | string)[] {
  const totalNumbers = 5; // how many page numbers to show (excluding dots)
  // If there are few pages, show all
  if (pageCount <= totalNumbers) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(page - 1, 3);
  const rightSiblingIndex = Math.min(page + 1, pageCount - 1);

  const showLeftDots = leftSiblingIndex > 3;
  const showRightDots = rightSiblingIndex < pageCount - 1;

  const range: (number | string)[] = [1];

  if (showLeftDots) {
    range.push("..");
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) {
      range.push(i);
    }
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    range.push(i);
  }

  if (showRightDots) {
    range.push("...");
  } else {
    for (let i = rightSiblingIndex + 1; i < pageCount; i++) {
      range.push(i);
    }
  }

  range.push(pageCount);

  return range;
}

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

  const paginationRange = getPaginationRange(page, pageCount);

  return (
    <nav className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      <Tooltip>
        <TooltipTrigger >
          <Button
            className="text-cyprus text-xs p-2 sm:text-base sm:p-3"
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
      <div className="flex items-center flex-wrap gap-1">
        {paginationRange.map((item, idx) =>
          item === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-500 select-none">
              ...
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? "outline" : "outline"}
              size="sm"
              onClick={() => onPageChange(Number(item))}
              disabled={item === page}
              className="text-xs p-2 sm:text-base sm:p-3"
            >
              {item}
            </Button>
          )
        )}
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
