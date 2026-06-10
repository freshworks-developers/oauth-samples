import React, { useEffect, useState } from 'react';
import { FwInlineMessage } from '@freshworks/crayons/react';
import AsanaLogo from './AsanaLogo';
import CreateTaskPanel from './CreateTaskPanel';
import { fetchOAuthAccounts, parseIparamGid } from '../utils/asana-api';

export default function AsanaApp({ client }) {
  const [accounts, setAccounts] = useState([]);
  const [defaultAccount, setDefaultAccount] = useState('');
  const [defaultWorkspace, setDefaultWorkspace] = useState('');
  const [defaultProject, setDefaultProject] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function bootstrap() {
      try {
        const [oauthAccounts, iparams] = await Promise.all([
          fetchOAuthAccounts(client),
          client.iparams.get()
        ]);
        setAccounts(oauthAccounts);
        setDefaultAccount(oauthAccounts[0] || '');
        setDefaultWorkspace(parseIparamGid(iparams.asana_workspace));
        const projects = parseIparamGid(iparams.asana_projects);
        if (Array.isArray(projects) && projects.length) {
          setDefaultProject(projects[0]);
        } else if (typeof projects === 'string' && projects) {
          setDefaultProject(projects);
        }
      } catch (bootstrapError) {
        setError('Connect an Asana OAuth account during app install, then reload this ticket.');
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, [client]);

  if (loading) {
    return <p className="asana-loading-text">Loading Asana…</p>;
  }

  if (error) {
    return (
      <div className="asana-app">
        <FwInlineMessage type="error" closable={false}>
          {error}
        </FwInlineMessage>
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div className="asana-app">
        <FwInlineMessage type="warning" closable={false}>
          No Asana OAuth accounts found. Complete OAuth at install time.
        </FwInlineMessage>
      </div>
    );
  }

  return (
    <div className="asana-app">
      <header className="asana-header">
        <AsanaLogo size={32} />
        <div className="asana-header-copy">
          <h1>Asana Sprint Tasks</h1>
          <p>Create Asana tasks from this ticket.</p>
        </div>
      </header>

      <CreateTaskPanel
        client={client}
        accounts={accounts}
        defaultAccount={defaultAccount}
        defaultWorkspace={defaultWorkspace}
        defaultProject={defaultProject}
      />
    </div>
  );
}
