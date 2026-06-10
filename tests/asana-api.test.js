import {
  buildTicketNotes,
  parseIparamGid,
  parseTemplateResponse,
  pickValidItemGid,
  toSelectOptions
} from '../app/utils/asana-api';

describe('asana-api helpers', function () {
  test('parseIparamGid extracts gid from labeled option', function () {
    expect(parseIparamGid('Sprint Board (1209182347712)')).toBe('1209182347712');
    expect(parseIparamGid('1209182347712')).toBe('1209182347712');
  });

  test('pickValidItemGid resolves by gid or name', function () {
    const items = [{ gid: '99', name: 'My workspace' }];
    expect(pickValidItemGid('My workspace', items, '')).toBe('99');
    expect(pickValidItemGid('', items, 'My workspace (99)')).toBe('99');
  });

  test('parseTemplateResponse throws on HTTP error status', function () {
    expect(function () {
      parseTemplateResponse({ status: 400, response: '{"errors":[]}' });
    }).toThrow('Asana request failed (400)');
  });

  test('parseTemplateResponse parses JSON strings', function () {
    const parsed = parseTemplateResponse({ response: '{"data":[]}' });
    expect(parsed).toEqual({ data: [] });
  });

  test('buildTicketNotes includes ticket context', function () {
    const notes = buildTicketNotes({
      id: 42,
      subject: 'Login broken',
      description: 'Users cannot sign in.'
    });
    expect(notes).toContain('Freshdesk ticket #42');
    expect(notes).toContain('Login broken');
  });

  test('toSelectOptions maps gid and name', function () {
    const options = toSelectOptions([{ gid: '1', name: 'Alpha' }], 'gid', 'name');
    expect(options).toEqual([{ value: '1', text: 'Alpha' }]);
  });
});
