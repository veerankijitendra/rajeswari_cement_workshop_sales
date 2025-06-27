import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { SearchParamsEnum } from "@/lib/resource"

export default function useFilterClear() {
    const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const resetFilters = () => {
        router.replace(pathname)
    }

    useEffect(() => {
        setIsFilterApplied(!!(searchParams.has(SearchParamsEnum.CATEGORY) || searchParams.has(SearchParamsEnum.SEARCH) || searchParams.has(SearchParamsEnum.PER_PAGE)))
    },[searchParams])


    return {
        isFilterApplied,
        resetFilters
    }
}