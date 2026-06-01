exports = {
  createGitHubIssue: async function (args) {
    try {
      const credentialResponse = await $credentials.oauth({ version: 'v1' }).get({ oauthName: 'github' });
      const desiredGitHubAccount = credentialResponse.results[0].account_name;

      const response = await $request.invokeTemplate('create_github_issue', {
        options: { account: desiredGitHubAccount },
        body: JSON.stringify({
          title: args.title,
          body: args.body || 'Created from Freshdesk via OAuth sample app.'
        })
      });
      console.info('Successfully created GitHub issue');
      renderData(null, response);
    } catch (error) {
      console.error('Failed to create GitHub issue', error);
      renderData(error);
    }
  },

  getOAuthAccounts: async function (args) {
    try {
      const oauthNames = await $credentials.oauth({ version: 'v1' }).get({ oauthName: args.oauthName });
      const accounts = oauthNames.results.map((account) => account.account_name);
      console.info('Returning OAuth accounts', accounts);
      renderData(null, accounts);
    } catch (error) {
      console.error('Failed to get OAuth credentials', error);
      renderData(error);
    }
  }
};
