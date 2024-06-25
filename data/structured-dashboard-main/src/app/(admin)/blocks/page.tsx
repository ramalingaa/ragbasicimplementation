import BlockDetailsContainer from 'components/blocks/BlockDetailsContainer';
import BlocksContainer from 'components/blocks/BlocksContainer';
import Card from 'components/card/Card';
import DashboardHeadingWithDescription from 'components/dashboardHeadingWithDescription/DashboardHeadingWithDescription';
import EmptyState from 'components/emptyState/EmptyState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blocks',
};

export default function Default() {
  return (
    <div className="flex flex-col h-full">
      <BlocksContainer />
      <BlockDetailsContainer />
    </div>
  );
}
