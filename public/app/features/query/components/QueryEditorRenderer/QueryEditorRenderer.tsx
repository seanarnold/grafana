import React from 'react';
import { useAsync } from 'react-use';

import { CoreApp, DataQuery, PanelData, TimeRange } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { hasReactQueryEditor, ReactEditorRenderer } from './ReactEditorRenderer';
import { AngularEditorRenderer, hasAngularQueryEditor } from './AngularEditorRenderer';

interface Props {
  name?: string;
  onChange: (q: DataQuery) => void;
  onRunQuery: () => void;
  query: DataQuery;
  queries: DataQuery[];
  timeRange?: TimeRange;
  data?: PanelData;
  app?: CoreApp;
}

export function QueryEditorRenderer(props: Props) {
  const { app, name, timeRange, query, queries, onChange, data, onRunQuery } = props;

  const state = useAsync(() => {
    if (!name) {
      return Promise.resolve(undefined);
    }
    return getDataSourceSrv().get(name);
  }, [name]);

  if (!name || state.loading) {
    return null;
  }

  if (state.error) {
    return <div>Error loading datasource editor</div>;
  }

  const { value: dataSource } = state;

  if (!dataSource) {
    return null;
  }

  if (hasReactQueryEditor(dataSource)) {
    return (
      <ReactEditorRenderer
        key={dataSource.name}
        timeRange={timeRange}
        query={query}
        queries={queries}
        dataSource={dataSource}
        onChange={onChange}
        onRunQuery={onRunQuery}
        data={data}
        app={app}
      />
    );
  }

  if (hasAngularQueryEditor(dataSource)) {
    return (
      <AngularEditorRenderer
        key={dataSource.name}
        timeRange={timeRange}
        query={query}
        queries={queries}
        dataSource={dataSource}
        onChange={onChange}
        onRunQuery={onRunQuery}
        data={data}
        app={app}
      />
    );
  }

  return <div>Data source plugin does not export any Query Editor component</div>;
}