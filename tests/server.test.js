const fs = require('fs');
const path = require('path');
const vm = require('vm');

global.renderData = vi.fn();
global.$credentials = {
  oauth: vi.fn(() => ({
    get: vi.fn(() =>
      Promise.resolve({
        results: [{ account_name: 'work@example.com' }]
      })
    )
  }))
};

function loadFdkServer(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = {
    exports: {},
    $credentials: global.$credentials,
    renderData: global.renderData,
    console: console
  };
  vm.runInNewContext(code, sandbox, { filename: filePath });
  return sandbox.exports;
}

const server = loadFdkServer(path.join(__dirname, '../server/server.js'));

describe('server.js', function () {
  beforeEach(function () {
    vi.clearAllMocks();
  });

  test('getOAuthAccounts is exported', function () {
    expect(server.getOAuthAccounts).toBeDefined();
    expect(typeof server.getOAuthAccounts).toBe('function');
  });

  test('getOAuthAccounts returns account names', async function () {
    await server.getOAuthAccounts({ oauthName: 'asana' });
    expect($credentials.oauth).toHaveBeenCalledWith({ version: 'v1' });
    expect(renderData).toHaveBeenCalledWith(null, ['work@example.com']);
  });
});
