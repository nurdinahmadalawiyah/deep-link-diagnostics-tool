import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

interface DiffViewerProps {
  expected: string;
  actual: string;
}

export function DiffViewer({ expected, actual }: DiffViewerProps) {
  return (
    <div className="rounded-md overflow-hidden text-sm border border-zinc-200 dark:border-zinc-800">
      <ReactDiffViewer
        oldValue={expected}
        newValue={actual}
        splitView={false}
        compareMethod={DiffMethod.WORDS}
        useDarkTheme={true}
      />
    </div>
  );
}
