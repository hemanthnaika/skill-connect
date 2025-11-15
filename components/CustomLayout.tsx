import React from "react";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32">{children}</div>
  );
};

export default CustomLayout;
