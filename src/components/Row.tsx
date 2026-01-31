import React from "react";
import Group, { GroupProps } from "./Group";

export interface RowProps {
  groups: GroupProps[];
  className?: string;
  title?: string;
}

const Row: React.FC<RowProps> = ({ groups, className }) => (
  <div className="w-full">
    <div className={`flex flex-col md:flex-row justify-start w-full ${className || ""}`}>
      {groups.length === 1 ? (
        <div className="w-full">
          <Group {...groups[0]} />
        </div>
      ) : (
        <>
          {/* First group - 2/3 width */}
          {groups[0] && (
            <div className="max-w-full md:max-w-2/3 pr-8 w-full md:w-2/3 overflow-hidden">
              <Group {...groups[0]} />
            </div>
          )}

          {/* Second group - 1/3 width */}
          {groups[1] && (
            <div className="w-full md:w-1/3">
              <Group {...groups[1]} />
            </div>
          )}

          {/* Additional groups beyond the first two */}
          {groups.slice(2).map((group, idx) => (
            <div key={idx + 2} className="w-full">
              <Group {...group} />
            </div>
          ))}
        </>
      )}
    </div>
  </div>
);

export default Row;
