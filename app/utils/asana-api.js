export function parseIparamGid(value) {
  if (!value) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.map(parseIparamGid).filter(Boolean);
  }
  if (typeof value === 'string') {
    const match = value.match(/\(([^)]+)\)$/);
    return match ? match[1] : value;
  }
  return String(value);
}

export function parseTemplateResponse(result) {
  const status = result && result.status;
  if (status && Number(status) >= 400) {
    const raw = result.response;
    const detail = typeof raw === 'string' ? raw : JSON.stringify(raw);
    throw new Error('Asana request failed (' + status + '): ' + detail);
  }

  const raw = result && result.response !== undefined ? result.response : result;
  if (typeof raw === 'string') {
    return JSON.parse(raw);
  }
  return raw || {};
}

export function pickValidItemGid(currentValue, items, preferredValue) {
  if (!items || !items.length) {
    return '';
  }

  function resolve(value) {
    if (!value) {
      return '';
    }
    const raw = parseIparamGid(value);
    const byGid = items.find(function (item) {
      return String(item.gid) === String(raw);
    });
    if (byGid) {
      return String(byGid.gid);
    }
    const byName = items.find(function (item) {
      return item.name === raw || item.name === value;
    });
    if (byName) {
      return String(byName.gid);
    }
    return /^\d+$/.test(String(raw)) ? String(raw) : '';
  }

  const current = resolve(currentValue);
  if (current && items.some(function (item) { return String(item.gid) === current; })) {
    return current;
  }

  const preferred = resolve(preferredValue);
  if (preferred && items.some(function (item) { return String(item.gid) === preferred; })) {
    return preferred;
  }

  return items[0] ? String(items[0].gid) : '';
}

export async function fetchOAuthAccounts(client) {
  const result = await client.request.invoke('getOAuthAccounts', { oauthName: 'asana' });
  return result.response || [];
}

export async function fetchWorkspaces(client, account) {
  const result = await client.request.invokeTemplate('get_asana_workspace', {
    options: { account }
  });
  const body = parseTemplateResponse(result);
  return body.data || [];
}

export async function fetchProjects(client, account, workspaceGid) {
  const result = await client.request.invokeTemplate('get_asana_projects', {
    options: {
      account,
      context: { workspace_gid: workspaceGid }
    }
  });
  const body = parseTemplateResponse(result);
  return (body.data || []).filter(function (project) {
    return !project.archived;
  });
}

export async function createTask(client, account, payload) {
  const result = await client.request.invokeTemplate('create_asana_task', {
    options: { account },
    body: JSON.stringify({ data: payload })
  });
  const body = parseTemplateResponse(result);
  return body.data || body;
}

function normalizeTicket(ticket) {
  return {
    id: ticket.id || null,
    subject: ticket.subject || ticket.display_id || '',
    description: ticket.description_text || ticket.description || ''
  };
}

export async function fetchTicketContext(client) {
  try {
    const data = await client.data.get('ticket');
    return normalizeTicket((data && data.ticket) || {});
  } catch {
    return normalizeTicket({});
  }
}

export function buildTicketNotes(ticket, maxLength) {
  const limit = maxLength || 1200;
  const lines = [];
  if (ticket.id) {
    lines.push('Freshdesk ticket #' + ticket.id);
  }
  if (ticket.subject) {
    lines.push('Subject: ' + ticket.subject);
  }
  if (ticket.description) {
    lines.push('');
    lines.push(ticket.description);
  }
  const notes = lines.join('\n').trim();
  if (notes.length <= limit) {
    return notes;
  }
  return notes.slice(0, limit - 3) + '...';
}

export function toSelectOptions(items, valueKey, labelKey) {
  return items.map(function (item) {
    return {
      value: String(item[valueKey]),
      text: item[labelKey] || String(item[valueKey])
    };
  });
}
