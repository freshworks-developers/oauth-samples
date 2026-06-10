import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FwInput,
  FwSelect,
  FwTextarea
} from '@freshworks/crayons/react';
import {
  buildTicketNotes,
  createTask,
  fetchProjects,
  fetchTicketContext,
  fetchWorkspaces,
  pickValidItemGid,
  toSelectOptions
} from '../utils/asana-api';

export default function CreateTaskPanel({
  client,
  accounts,
  defaultAccount,
  defaultWorkspace,
  defaultProject
}) {
  const [account, setAccount] = useState(defaultAccount || '');
  const [workspaceGid, setWorkspaceGid] = useState('');
  const [projectGid, setProjectGid] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueOn, setDueOn] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const accountOptions = useMemo(function () {
    return accounts.map(function (name) {
      return { value: name, text: name };
    });
  }, [accounts]);

  const workspaceOptions = useMemo(function () {
    return toSelectOptions(workspaces, 'gid', 'name');
  }, [workspaces]);

  const loadTicketDefaults = useCallback(async function () {
    const ticket = await fetchTicketContext(client);
    if (ticket.subject) {
      setTitle(ticket.subject);
    }
    setNotes(buildTicketNotes(ticket));
  }, [client]);

  const resolveDefaultProject = useCallback(async function (selectedAccount, selectedWorkspace) {
    if (!selectedAccount || !selectedWorkspace) {
      setProjectGid('');
      return;
    }
    try {
      const projects = await fetchProjects(client, selectedAccount, selectedWorkspace);
      setProjectGid(pickValidItemGid('', projects, defaultProject));
    } catch {
      setProjectGid(pickValidItemGid('', [], defaultProject));
    }
  }, [client, defaultProject]);

  const loadWorkspaces = useCallback(async function (selectedAccount) {
    if (!selectedAccount) {
      return;
    }

    setLoadingMeta(true);
    try {
      const items = await fetchWorkspaces(client, selectedAccount);
      setWorkspaces(items);
      let resolvedWorkspace = '';
      setWorkspaceGid(function (current) {
        resolvedWorkspace = pickValidItemGid(current, items, defaultWorkspace);
        return resolvedWorkspace;
      });
      if (resolvedWorkspace) {
        await resolveDefaultProject(selectedAccount, resolvedWorkspace);
      }
    } catch {
      setWorkspaces([]);
    } finally {
      setLoadingMeta(false);
    }
  }, [defaultWorkspace, resolveDefaultProject]);

  useEffect(function () {
    loadTicketDefaults();
  }, [loadTicketDefaults]);

  useEffect(function () {
    if (defaultAccount) {
      setAccount(defaultAccount);
    }
  }, [defaultAccount]);

  useEffect(function () {
    if (account) {
      loadWorkspaces(account);
    }
  }, [account, loadWorkspaces]);

  async function handleWorkspaceChange(nextWorkspace) {
    setWorkspaceGid(nextWorkspace);
    await resolveDefaultProject(account, nextWorkspace);
  }

  async function handleCreate() {
    if (!account || !title.trim()) {
      await client.interface.trigger('showNotify', {
        type: 'warning',
        message: 'Select an account and enter a task title.'
      });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: title.trim(),
        notes: notes.trim(),
        completed: false
      };
      if (workspaceGid) {
        payload.workspace = workspaceGid;
      }
      if (projectGid) {
        payload.projects = [projectGid];
      }
      if (dueOn) {
        payload.due_on = dueOn;
      }
      const created = await createTask(client, account, payload);
      await client.interface.trigger('showNotify', {
        type: 'success',
        message: 'Asana task created.'
      });
      if (created.permalink_url) {
        window.open(created.permalink_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      await client.interface.trigger('showNotify', {
        type: 'danger',
        message: 'Failed to create Asana task.'
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="asana-panel">
      <FwSelect
        label="Asana account"
        value={account}
        required
        options={accountOptions}
        onFwChange={(event) => setAccount(event.detail.value)}
      />

      <FwSelect
        label="Workspace"
        value={workspaceGid}
        required
        options={workspaceOptions}
        placeholder={loadingMeta && !workspaceOptions.length ? 'Loading workspaces…' : 'Select a workspace'}
        onFwChange={(event) => handleWorkspaceChange(event.detail.value)}
      />

      <FwInput
        label="Task title"
        value={title}
        required
        onFwInput={(event) => setTitle(event.detail.value)}
      />

      <FwTextarea
        label="Notes"
        value={notes}
        rows={4}
        onFwInput={(event) => setNotes(event.detail.value)}
      />

      <FwInput
        label="Due date"
        type="date"
        value={dueOn}
        onFwInput={(event) => setDueOn(event.detail.value)}
      />

      <div className="asana-actions">
        <button
          type="button"
          className="asana-action-btn"
          disabled={submitting || loadingMeta}
          onClick={handleCreate}
        >
          {submitting ? 'Creating…' : 'Create Asana task'}
        </button>
      </div>
    </div>
  );
}
