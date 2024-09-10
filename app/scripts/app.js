init();

async function init() {
  window.client = await app.initialized();
  client.events.on('app.activated', setupApp);
}

async function setupApp() {
  console.log(await client.iparams.get());
  try {
    let result = await client.request.invoke('getOAuthAccounts', { oauthName: 'asana' });
    const asanaAccountSelect = document.getElementById('asanaAccountSelect');
    const oauthNames = [];
  
    // Dynamically add options to the dropdown with Asana OAuth accounts
    result.response.forEach(account => {
      oauthNames.push({
        value: account,
        text: account
      })
    });
    
    asanaAccountSelect.options = oauthNames;

    const btnSubmit = document.getElementById('btnSubmit');
    btnSubmit.addEventListener('click', async function () {
      const asanaTitle = document.getElementById('inputAsanaTitle').value;
      const githubTitle = document.getElementById('inputGithubTitle').value;

      await createAsanaTaskAndGitHubIssue(asanaTitle, githubTitle);
    });
  } catch (error) {
    console.error("Error: Failed to get credentials");
    console.error(error);
  }
}

/**
 * 
 * @param {String} asanaTitle - A title for the Asana task
 * @param {String} githubTitle - A title for the GitHub issue
 * @returns {Promise<String>}
 */
async function createAsanaTaskAndGitHubIssue(asanaTitle, githubTitle) {
  try {
    await createAsanaTask(asanaTitle);
    try {
      await createGitHubIssue(githubTitle);

      client.interface.trigger('showNotify', {
        type: 'success',
        message: 'Asana task and GitHub issue created successfully!'
      });  
    } catch (error) {
      console.error("Error: Failed to create github issue");
      console.error(error);
    }
  } catch (error) {
    console.error("Error: Failed to create asana ticket");
    console.error(error);
  } 
}

/**
 * 
 * @param {String} title - A title for the Asana task
 * @returns {Promise<String>}
 */
async function createAsanaTask(title) {
  const AsanaProjectId = "12345";
  const AsanaWorkspaceId = "123456";

  const desiredAsanaAccount = document.getElementById('asanaAccountSelect').value;
  console.log(desiredAsanaAccount);

  return client.request.invokeTemplate('create_asana_task', {
    options: {
      account: desiredAsanaAccount
    },
    body: JSON.stringify({
      data: {
        projects: [AsanaProjectId],
        workspace: AsanaWorkspaceId,
        parent: "null",
        name: title,
        completed: false
      }
    })
  });
}

/**
 * 
 * @param {String} title - A title for the GitHub issue
 * @returns {Promise<String>}
 */
async function createGitHubIssue(title) {    
  return client.request.invoke('createGitHubIssue', {
    "title": title
  });
}
