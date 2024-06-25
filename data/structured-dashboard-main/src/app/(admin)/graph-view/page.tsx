import Card from 'components/card/Card';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Graphs',
}

export default function Default() {
  return (
    <Card className='w-full mt-24'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '600px',
          overflow: 'hidden',
        }}
      >
        {/* <GraphComponent2 /> */}
      </div>
    </Card>
  );
}
