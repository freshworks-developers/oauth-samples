# OAuth Sample App with Asana and GitHub

This app creates a task in Asana and a GitHub issue at once from the ticket sidebar.

This app demonstrates the following features

1. [OAuth 2.0 - account level OAuth](https://developers.freshworks.com/docs/app-sdk/v3.0/common/advanced-interfaces/request-method/oauth/).
2. Making an API request through [Request Method](https://developers.freshworks.com/docs/app-sdk/v3.0/common/advanced-interfaces/request-method/) using OAuth access token to authenticate.
3. [Serverless invocation method (SMI)](https://developers.freshworks.com/docs/app-sdk/v3.0/common/smi-apps/).
4. Using a [installation parameters](https://developers.freshworks.com/docs/app-sdk/v3.0/common/app-settings/app-installation-page/installation-page/) to dynamically populate dependent fields (workspace, project) from Asana and fill the GitHub repository name.

## Prerequisites

1. It is mandatory to have a Asana account and a GitHub account.
2. You must have [an OAuth app registered](https://developers.asana.com/docs/oauth) in Asana and [in GitHub](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

## Installation

1. Download the app from [here](https://github.com/freshworks-developers/oauth-samples/).
2. [Upload and install the app in your account](https://developers.freshworks.com/docs/getting-started/freshdesk/deploy-first-app/).
3. Open any ticket details page and open the app in the sidebar.
4. Choose an Asana account from the dropdown and enter the task name and GitHub issue title.
5. Click on the **Submit** button and notice the task and issue created in Asana and GitHub.

## Support

If you have any questions or feedback, please contact us at support@freshworks.com or visit our [developer forum](https://community.freshworks.com/).
