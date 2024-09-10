/**
 * 
 * @param {String} title - A title for the GitHub issue
 * @returns {Promise<String>}
 */
async function createGitHubIssue(args) {
  return $request.invokeTemplate('create_github_issue', {
    options: {
      account: 'default'
    },
    body: JSON.stringify({
      "title": args.title,
      "body": "I'm having a problem with this."
    })
  });
}

exports = {
  getListSMI: async function (args) {
    try {
      let data = await $request.invokeTemplate("getListSMI", {
        iparam: args.iparams
      });
      let listData = JSON.parse(data.response);
      renderData(null, listData);
    }
    catch (error) {
      console.error("Error while attempting to fetch lists");
      console.error(error);
      renderData(error, null);
    }
  },

  createGitHubIssue: async function (args) {
    try {
      const response = await $credentials.oauth({ version: 'v1' }).get({ oauthName: 'github' });
      const oauthAccounts = response.results;
      const desiredGitHubAccount = oauthAccounts[0].account_name; // We take 0th account here, but you can choose based on the payload information.
      
      try {
        const response = await $request.invokeTemplate('create_github_issue', {
          options: {
            account: desiredGitHubAccount
          },
          body: JSON.stringify({
            "title": args.title,
            "body": "I'm having a problem with this."
          })
        });
        console.info('Successfully created GitHub issue');
        renderData(null, response);
      } catch (error) {
        console.error("Error: Failed to create github issue");
        console.error(error);
        renderData(error);
      }
    } catch (error) {
      console.error("Error: Failed to get OAuth credentials");
      console.error(error);
      renderData(error);
    }
  },

  getOAuthAccounts: async function (args) {
    try {
      let oauthNames = await $credentials.oauth({ version: 'v1' }).get({ oauthName: args.oauthName });
      const accounts = oauthNames.results.map(account => account.account_name);
      console.info('Returning OAuth accounts', accounts);
      renderData(null, accounts);
    } catch (error) {
      console.error("Error: Failed to get credentials");
      console.error(error);
      renderData(error);
    }
  }
}
