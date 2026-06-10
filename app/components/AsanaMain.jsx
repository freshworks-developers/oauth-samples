import React, { useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';
import AsanaApp from './AsanaApp';

defineCustomElements();

const SIDEBAR_HEIGHT = '720px';

function AsanaMain() {
  const [child, setChild] = useState(
    <p className="asana-loading-text">Loading Asana integration…</p>
  );

  useLayoutEffect(function () {
    window.app.initialized().then(function (client) {
      window.client = client;
      const resize = function () {
        client.instance.resize({ height: SIDEBAR_HEIGHT }).catch(function () {
          return null;
        });
      };
      resize();
      client.events.on('app.activated', resize);
      setChild(<AsanaApp client={client} />);
    });
  }, []);

  return <div className="asana-root">{child}</div>;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AsanaMain />
  </React.StrictMode>
);
