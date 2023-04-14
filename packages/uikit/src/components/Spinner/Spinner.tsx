import React from "react";
import { Image, Box } from "@pancakeswap/uikit";
import { SpinnerProps } from "./types";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Box width={size} height={size} position="relative">
      <Image
        width={size}
        height={size}
        src="/images/spinner.png"
        alt="pancake-3d-spinner"
      />
    </Box>
  );
};

export default Spinner;
