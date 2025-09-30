import React from 'react';
import Group from './Group';

interface PageProps {
  groups: any[];
}

const Page: React.FC<PageProps> = ({ groups }) => {
  return (
    <div className=''>
      {groups?.map((group, idx) => (
        <Group key={idx} backgroundImage={group.bgImage} sections={group.sections} />
      ))}
    </div>
  );
};

export default Page;
