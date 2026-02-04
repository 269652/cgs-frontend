import React from "react";
import Teaser, { TeaserProps } from "./Teaser";

interface TripleTeaseProps {
  title: string;
  teasers: [TeaserProps, TeaserProps, TeaserProps];
}

const TripleTease: React.FC<TripleTeaseProps> = ({ title, teasers }) => (
  <div className="w-full flex flex-col items-center py-8 h-full">
    <h2 className="text-4xl font-bold mb-10 text-center">{title}</h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center w-full h-full px-12 py-4">
      {teasers.map((teaser, idx) => (
        <div key={idx} className=" h-auto flex-1 grow">
          <Teaser {...teaser} />
        </div>
      ))}
    </div>
  </div>
);

export default TripleTease;
