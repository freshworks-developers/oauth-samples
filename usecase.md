# Use Cases — DevStream Agency

## Company Overview

**DevStream Agency** builds custom software for clients and runs support on **Freshdesk**. When production defects arrive as tickets, engineering needs the same work tracked in **GitHub** and the client sprint board in **Asana** without copy-paste between tools.

---

## Use Case Scenarios

### 1. Ticket-to-GitHub handoff

**Scenario:** A P1 ticket reports a regression in the payment API; engineering needs a GitHub issue with the ticket summary.

**Use Case:** Agents enter issue title in the sidebar and invoke **createGitHubIssue** SMI, which selects the connected GitHub OAuth account and posts via request template with `access_token`.

### 2. Sprint alignment in Asana

**Scenario:** The PM wants every defect tied to the active sprint workspace.

**Use Case:** **create_asana_task** runs from the frontend with the agent-selected OAuth account from the dropdown populated by **getOAuthAccounts**.

### 3. Multi-account OAuth estates

**Scenario:** DevStream maintains separate Asana workspaces per client.

**Use Case:** Account-level OAuth lets agents pick the correct workspace account before creating tasks, avoiding misfiled work items.

### 4. Dual-system creation under load

**Scenario:** During release week, 40 tickets/day need paired GitHub + Asana items.

**Use Case:** One submit creates both artifacts sequentially with in-app success notification, reducing average handoff time versus manual dual entry.

### 5. Audit trail for client billing

**Scenario:** Fixed-bid clients bill only for engineering time traceable to support tickets.

**Use Case:** GitHub issue body references Freshdesk context; Asana task name mirrors the defect title so monthly reports reconcile support volume to delivery work.
