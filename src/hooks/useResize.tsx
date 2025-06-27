import { useEffect, useState } from "react";

export default function useResize() {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 500);

    const handleResize = () => {
        setIsMobile(window.innerWidth < 500);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
}