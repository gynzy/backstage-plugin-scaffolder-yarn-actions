import {
  createTemplateAction,
  executeShellCommand,
} from '@backstage/plugin-scaffolder-node';
import { getYarnCommand } from '../../utils/getYarnCommand';

export function createYarnAddAction() {
  return createTemplateAction<{ packageToInstall: string }>({
    id: 'yarn:add',
    description: 'Runs yarn add quietly to install the given package name',
    supportsDryRun: true,
    schema: {
      input: {
        type: 'object',
        required: ['packageToInstall'],
        properties: {
          packageToInstall: {
            title: 'Name of package to install',
            description: 'Name of package to install',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      try {
        if (!ctx.input.packageToInstall) {
          throw new Error('No package provided');
        }

        ctx.logger.info(`Running yarn add in ${ctx.workspacePath}`);

        const yarn = getYarnCommand(ctx);

        await executeShellCommand({
          command: yarn,
          args: ['add', ctx.input.packageToInstall],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        ctx.logger.info(`Done running yarn add`);
      } catch (err) {
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
