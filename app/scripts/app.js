init();

async function init() {
  window.client = await app.initialized();
  client.events.on('app.activated', setupApp);
}

async function setupApp() {
  try {
    const result = await client.request.invoke('getOAuthAccounts', { oauthName: 'asana' });
    const asanaAccountSelect = document.getElementById('asanaAccountSelect');
    asanaAccountSelect.options = result.response.map((account) => ({
      value: account,
      text: account
    }));

    document.getElementById('btnSubmit').addEventListener('fwClick', async function () {
      const asanaTitle = document.getElementById('inputAsanaTitle').value;
      const githubTitle = document.getElementById('inputGithubTitle').value;
      await createAsanaTaskAndGitHubIssue(asanaTitle, githubTitle);
    });
  } catch (error) {
    console.error('Failed to load OAuth accounts', error);
  }
}

async function createAsanaTaskAndGitHubIssue(asanaTitle, githubTitle) {
  try {
    await createAsanaTask(asanaTitle);
    await createGitHubIssue(githubTitle);
    await client.interface.trigger('showNotify', {
      type: 'success',
      message: 'Asana task and GitHub issue created successfully.'
    });
  } catch (error) {
    console.error('Failed to create Asana task or GitHub issue', error);
    await client.interface.trigger('showNotify', {
      type: 'danger',
      message: 'Could not create the Asana task or GitHub issue.'
    });
  }
}

async function createAsanaTask(title) {
  const iparams = await client.iparams.get();
  const desiredAsanaAccount = document.getElementById('asanaAccountSelect').value;

  return client.request.invokeTemplate('create_asana_task', {
    options: { account: desiredAsanaAccount },
    body: JSON.stringify({
      data: {
        projects: [iparams.asana_projects],
        workspace: iparams.asana_workspace,
        name: title,
        completed: false
      }
    })
  });
}

async function createGitHubIssue(title) {
  return await client.request.invoke('createGitHubIssue', { title });
}
