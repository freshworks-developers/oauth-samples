let client;

init();

async function init() {
  client = await app.initialized();
  window.getAsanaWorkspaces = getAsanaWorkspaces;
  window.getAsanaProjects = getAsanaProjects;
  window.validate = validate;
  await getAsanaWorkspaces();
}

function parseTemplateBody(data) {
  const raw = data && data.response !== undefined ? data.response : data;
  if (typeof raw === 'string') {
    return JSON.parse(raw);
  }
  return raw || {};
}

function formatOption(item) {
  return item.name + ' (' + item.gid + ')';
}

function extractGid(value) {
  if (!value || typeof value !== 'string') {
    return value || '';
  }
  const match = value.match(/\(([^)]+)\)$/);
  return match ? match[1] : value;
}

async function resolveAccount() {
  const result = await client.request.invoke('getOAuthAccounts', { oauthName: 'asana' });
  const accounts = result.response || [];
  return accounts[0] || '';
}

async function getAsanaWorkspaces() {
  const account = await resolveAccount();
  if (!account) {
    utils.set('asana_workspace', {
      values: [],
      hint: 'Connect Asana OAuth first at http://localhost:10001/custom_configs, then check Reload Asana lists.'
    });
    utils.set('asana_projects', { values: [], hint: 'Projects load after a workspace is selected.' });
    return;
  }

  try {
    const data = await client.request.invokeTemplate('get_asana_workspace', {
      options: { account: account }
    });
    const body = parseTemplateBody(data);
    const workspaces = body.data || [];
    const values = workspaces.map(formatOption);

    utils.set('asana_workspace', {
      values: values,
      hint: values.length
        ? 'Select the default workspace for new tasks.'
        : 'No workspaces found for the connected Asana account.'
    });

    if (values.length === 1) {
      utils.set('asana_workspace', { value: values[0] });
      await getAsanaProjects();
    } else {
      utils.set('asana_projects', { values: [], hint: 'Select a workspace to load projects.' });
    }
  } catch {
    utils.set('asana_workspace', {
      values: [],
      hint: 'Could not load workspaces. Re-authorize Asana OAuth, then check Reload Asana lists.'
    });
    utils.set('asana_projects', { values: [] });
  }
}

async function getAsanaProjects() {
  const account = await resolveAccount();
  const workspaceValue = utils.get('asana_workspace');
  const workspaceGid = extractGid(workspaceValue);

  if (!account) {
    utils.set('asana_projects', {
      values: [],
      hint: 'Connect Asana OAuth first at custom_configs.'
    });
    return;
  }

  if (!workspaceGid) {
    utils.set('asana_projects', {
      values: [],
      hint: 'Select a workspace to load projects.'
    });
    return;
  }

  try {
    const data = await client.request.invokeTemplate('get_asana_projects', {
      options: {
        account: account,
        context: { workspace_gid: workspaceGid }
      }
    });
    const body = parseTemplateBody(data);
    const projects = body.data || [];
    const values = projects.map(formatOption);

    utils.set('asana_projects', {
      values: values,
      hint: values.length
        ? 'Choose one or more default projects.'
        : 'No active projects in this workspace.'
    });
  } catch {
    utils.set('asana_projects', {
      values: [],
      hint: 'Could not load projects for the selected workspace.'
    });
  }
}

async function validate() {
  const workspace = extractGid(utils.get('asana_workspace'));
  const projects = utils.get('asana_projects') || [];
  const selectedProjects = Array.isArray(projects)
    ? projects.filter(function (project) {
        return extractGid(project);
      })
    : [];

  if (!workspace) {
    utils.set('asana_workspace', {
      hint: 'Select an Asana workspace before installing.'
    });
    return false;
  }

  if (!selectedProjects.length) {
    utils.set('asana_projects', {
      hint: 'Select at least one Asana project before installing.'
    });
    return false;
  }

  return true;
}
