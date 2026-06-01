let client;

init();

async function init() {
  client = await app.initialized();
  debouncedGetAsanaWorkspaces();
}

function getAsanaWorkspaces() {
  client.request
    .invokeTemplate('get_asana_workspace', { options: { account: 'default' } })
    .then(function (data) {
      const workspaces = JSON.parse(data.response);
      const values = workspaces.data.map((workspace) => workspace.gid);
      utils.set('asana_workspace', { values });
    })
    .catch(function (error) {
      console.error('getAsanaWorkspaces', error);
    });
}

function getAsanaProjects() {
  client.request
    .invokeTemplate('get_asana_projects', {
      options: { account: 'default' },
      context: { workspace: utils.get('asana_workspace') }
    })
    .then(function (data) {
      const projects = JSON.parse(data.response);
      const values = projects.data.map((project) => project.gid);
      utils.set('asana_projects', { values });
    })
    .catch(function (error) {
      console.error('getAsanaProjects', error);
    });
}

function debounce(callback, delay) {
  let timeoutId;
  return function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

const runGetAsanaWorkspaces = debounce(getAsanaWorkspaces, 500);
const runGetAsanaProjects = debounce(getAsanaProjects, 500);

function debouncedGetAsanaWorkspaces() {
  runGetAsanaWorkspaces();
}

// Referenced from config/iparams.json asana_workspace change event
// eslint-disable-next-line no-unused-vars
function debouncedGetAsanaProjects() {
  runGetAsanaProjects();
}
