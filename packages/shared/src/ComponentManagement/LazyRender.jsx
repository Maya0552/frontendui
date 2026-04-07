import React, { useState, useEffect, useRef } from "react";

/**
 * A component that renders its children only when it becomes visible in the viewport.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to render when the component becomes visible.
 * @returns {JSX.Element} The lazy-loaded component.
 */
export const LazyRender = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const containerRef = useRef(null);
    // console.log("Printing?", isPrinting)
    useEffect(() => {
        const handleBeforePrint = () => setIsPrinting(true);
        const handleAfterPrint = () => setIsPrinting(false);
    
        window.addEventListener("beforeprint", handleBeforePrint);
        window.addEventListener("afterprint", handleAfterPrint);
    
        return () => {
            window.removeEventListener("beforeprint", handleBeforePrint);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
      }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once visible
                }
            },
            { threshold: 0.1 } // Trigger when 10% of the component is visible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!isVisible && !isPrinting) {
        return (
            <div ref={containerRef} style={{ minHeight: "100px", backgroundColor: "#f8f9fa" }} />
        );
    } else {
        return (
            <div ref={containerRef}>
                {children}
            </div>
        );
    }
    
};
