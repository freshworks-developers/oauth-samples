exports = {

/**
 * @desc -
 *
 * This app makes a API request to create a new task in the selected workspace (project) during installation.
 * This app does not have any page to show up in the support portal, it works as a backround service which will
 * do the task creating action in the background whenever a ticket is created in Freshdesk.
 */

/**
 * In the following event listerner method, workspace_id and project_id have been taken from installation parameters.
 * Subject of the ticket is an attribute of ticket object in the payload from the event trigger.
 */

  onTicketCreateHandler: async function (payload) {
    try {
      const context = {
        workspace_id: payload.iparams.asana_details.workspace_id,
        ticket_subject: payload.data.ticket.subject,
        project_id: payload.iparams.asana_details.project_id,
        access_token: '<%= access_token %>'
      };
      await $request.invokeTemplate("createAsanaTask", { context });
    } catch (error) {
      // handle error
    }
  }
};