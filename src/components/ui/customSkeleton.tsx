import { useTheme } from "next-themes";
import type { FC } from "react";
import Skeleton from "react-loading-skeleton";

interface CustomSkeletonProps {
  lines: number;
}

const CustomSkeleton: FC<CustomSkeletonProps> = ({ lines }) => {
  const { theme } = useTheme();

  return (
    <Skeleton
      count={lines}
      baseColor={theme === "dark" ? "#202020" : ""}
      highlightColor={theme === "dark" ? "#444" : ""}
    />
  );
};

export default CustomSkeleton;
