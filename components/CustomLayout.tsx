import React from "react";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4 md:px-8 lg:px-16 xl:px-32">{children}</div>;
};

export default CustomLayout;
