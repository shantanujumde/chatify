"use client";
import { useEffect, useRef, useState, type FC } from "react";

type RevealOnScrollProps = {
  children: JSX.Element;
};

const RevealOnScroll: FC<RevealOnScrollProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divRef = ref.current;
    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        scrollObserver.unobserve(entry.target);
      }
    });

    if (divRef) scrollObserver.observe(divRef);

    return () => {
      if (divRef) {
        scrollObserver.unobserve(divRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        animationDuration: "2.5s",
      }}
      className={`scroll-smooth transition-opacity   duration-1000 
    ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {children}
    </div>
  );
};
export default RevealOnScroll;
