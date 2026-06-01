# OAuth samples — Asana and GitHub

Freshdesk ticket-sidebar app that creates an **Asana task** and a **GitHub issue** from one form, using **account-level OAuth** for both integrations.

## Real-world use case

When support escalates a bug, agents often duplicate work in a project tracker and a code repository. This sample shows how to **fan out one ticket action** into Asana (for PM visibility) and GitHub (for engineering) with secure OAuth tokens—no shared passwords in iparams.

## Features demonstrated

- Multi-provider OAuth 2.0 (Asana + GitHub) at account level
- Request templates with OAuth access tokens
- Server method invocation (`getOAuthAccounts`, `createGitHubIssue`)
- Dynamic installation fields (Asana workspace and project loaded after OAuth)

## Prerequisites

- Freshdesk dev account and [FDK 10.x](https://developers.freshworks.com/docs/app-sdk/v3.0/) on **Node.js 24.x**
- [Asana OAuth app](https://developers.asana.com/docs/oauth) and [GitHub OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- Replace placeholders in `config/oauth_config.json` with your client IDs and secrets

## Installation parameters

| Parameter | Description |
|-----------|-------------|
| `github_username` / `github_repository` | Target repo for new issues |
| `asana_workspace` / `asana_projects` | Workspace and project GIDs (populated dynamically after Asana OAuth) |

During install, connect both OAuth accounts. The installation page loads Asana workspaces and projects via `config/assets/iparams.js`.

## Setup and testing

1. Configure OAuth credentials in `config/oauth_config.json`.
2. Run `fdk validate` and `fdk run` from this folder.
3. Complete installation OAuth flows and iparams at `http://localhost:10001/custom_configs`.
4. Open a ticket sidebar, pick an Asana account, enter task and issue titles, and submit.

## Project structure

- `manifest.json` — Platform 3.0 hybrid app (`support_ticket` + common SMI/requests)
- `app/` — Crayons ticket sidebar UI
- `server/server.js` — OAuth account listing and GitHub issue SMI
- `config/` — OAuth config, request templates, dynamic iparams

## Support

Questions: [Freshworks developer community](https://community.freshworks.dev/).
