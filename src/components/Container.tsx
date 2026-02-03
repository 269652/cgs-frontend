import React from "react";

type ContainerProps = {
  children: React.ReactNode;
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="w-full columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {React.Children.map(children, (child) => (
        <div className="break-inside-avoid mb-4">
          {child}
        </div>
      ))}
    </div>
  );
};

export default Container;
