'use client';
import Associations from 'components/registry/Associations';
import Connections from 'components/registry/Connections';
import MergeButtonContainer from 'components/registry/MergeButtonContainer';

export default function Registry() {
  return (
    <div className='flex flex-col'>
      <MergeButtonContainer />
      <div className='flex w-full h-[600px] mt-[50px] justify-around'>
        <Connections />
        <Associations />
      </div>
    </div>
  );
}
