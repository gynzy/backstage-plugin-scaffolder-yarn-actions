import { PassThrough } from 'stream';
import { createYarnAddAction } from './add';
import { getVoidLogger } from '@backstage/backend-common';
import { executeShellCommand } from '@backstage/plugin-scaffolder-node';

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  executeShellCommand: jest.fn(),
}));

describe('yarn:add', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call action', async () => {
    const action = createYarnAddAction();

    const logger = getVoidLogger();

    await action.handler({
      input: { packageToInstall: 'test' },
      workspacePath: '/tmp',
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        throw new Error('Not implemented');
      },
    });

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: expect.stringContaining('yarn'),
        args: expect.arrayContaining(['add']),
      }),
    );
  });

  it('should call action with proper package to install', async () => {
    const action = createYarnAddAction();

    const logger = getVoidLogger();
    const packageToInstallString = 'my-package';

    await action.handler({
      input: { packageToInstall: packageToInstallString },
      workspacePath: '/tmp',
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        throw new Error('Not implemented');
      },
    });

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: expect.stringContaining('yarn'),
        args: expect.arrayContaining(['add', packageToInstallString]),
      }),
    );
  });
});
