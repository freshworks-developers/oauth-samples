exports = {
  getOAuthAccounts: async function (args) {
    try {
      const oauthNames = await $credentials.oauth({ version: 'v1' }).get({ oauthName: args.oauthName });
      const accounts = oauthNames.results.map(function (account) {
        return account.account_name;
      });
      renderData(null, accounts);
    } catch (error) {
      console.error('Error: Failed to get OAuth credentials');
      renderData(error);
    }
  }
};
