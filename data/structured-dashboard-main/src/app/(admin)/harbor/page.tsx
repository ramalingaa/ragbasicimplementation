'use client';
// Custom components
import ConnectedDataSources from 'components/harbor/ConnectedDataSources';
import HarborGraphView from 'components/harbor/HarborGraphView';
import { useHarborStore } from '../../../zustand/harbor/harborStore';
import Wrapper from 'components/queriesPage/wrapper/Wrapper';
import useEntityTypes from 'hooks/harbor/useEntityTypes';
import { useEffect } from 'react';
import EntityTypes from 'components/harbor/EntityTypes';
import UnitPage from 'components/harbor/UnitPage';
import SourcePage from 'components/harbor/Source';

const componentViews = [
  { name: 'source', Component: <Source /> },
  { name: 'unit', Component: <Unit /> },
  { name: 'type', Component: <Type /> },
];

export default function Harbor() {
  const { componentView } = useHarborStore();
  return (
    componentViews.find((view) => view.name === componentView)?.Component
  );
}

function Source() {
  const { harborViewMode } = useHarborStore();
  return (
    <SourcePage />
  );
}

function Type() {
  return <EntityTypes />
}

function Unit() {
  return (
    <UnitPage />
  )
}

function ComingSoon() {
  return (
    <div
      className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
      role="alert"
    >
      <p className="font-bold">Coming Soon</p>
      <p>Stay tuned for updates</p>
    </div>
  );
}