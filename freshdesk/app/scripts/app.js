init();

async function init() {
  window.client = await app.initialized();
  client.events.on('app.activated', setupApp);
}

function setupApp() {
  const btnSubmit = document.getElementById('btnSubmit');
  btnSubmit.addEventListener('click', async function () {
    const asanaTitle = document.getElementById('inputAsanaTitle').value;
    const githubTitle = document.getElementById('inputGithubTitle').value;

    try {
      await client.request.invokeTemplate('create_asana_task', {
        context: {},
        body: JSON.stringify({
          data: {
            projects: ["1206010023866335"],
            workspace: "1199978845655296",
            parent: "null",
            name: asanaTitle,
            completed: false
          }
        })
      });
      
      try{
        await client.request.invokeTemplate('create_github_issue', {
          context: {},
          body: JSON.stringify({
            "title": githubTitle,
            "body": "I'm having a problem with this."
          })
        });

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
  });
}
