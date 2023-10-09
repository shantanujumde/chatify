import { useEffect, useRef, useState, type FC } from "react";

type RevealOnScrollProps = {
  children: JSX.Element;
};

const RevealOnScroll: FC<RevealOnScrollProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        scrollObserver.unobserve(entry.target);
      }
    });

    if (ref.current) scrollObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        scrollObserver.unobserve(ref.current);
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
