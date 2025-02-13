let client
init();

async function init() {
  client = await app.initialized();
}

function getAsanaWorkspaces() {
  console.log('getAsanaWorkspaces');
  client.request.invokeTemplate('get_asana_workspace', {
    options: { account: 'default' }
  })
    .then(function (data) {
      console.log('getAsanaWorkspaces', data);
      let workspaces = JSON.parse(data.response);
      const values = [];
      workspaces.data.map(workspace => {
        values.push(workspace.gid);
      });
      utils.set('asana_workspace', {values: values});
    })
    .catch(function (error) {
      console.error('getAsanaWorkspaces', error);
    });
}

function getAsanaProjects() {
  client.request.invokeTemplate('get_asana_projects', {
    options: {
      account: 'default',
      context: {
        workspace: utils.get('asana_workspace')
      }
     }
  })
    .then(function (data) {
      console.log('getAsanaProjects', data);
      let projects = JSON.parse(data.response);
      const values = [];
      projects.map(project => {
        values.push(project.gid);
      });
      utils.set('asana_projects', {values: values});
    })
    .catch(function (error) {
      console.error('getAsanaProjects', error);
    });
}

function debounce(callback, delay) {
    let timeoutId;

    return function(...args) {
        // If there's a previous scheduled callback, clear it
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Schedule the callback to be called after the specified delay
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

// Wrap the functions with debounce
function debouncedGetAsanaWorkspaces() {
  debounce(getAsanaWorkspaces, 500);
}

function debouncedGetAsanaProjects() {
  debounce(getAsanaProjects, 500);
}
