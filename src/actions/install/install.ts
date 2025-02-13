import {
  createTemplateAction,
  executeShellCommand,
} from '@backstage/plugin-scaffolder-node';
import { getYarnCommand } from '../../utils/getYarnCommand';

export function createYarnInstallAction() {
  return createTemplateAction<{ arguments: string[] }>({
    id: 'yarn:install',
    description:
      'Runs yarn install in the task workspace directory',
    supportsDryRun: false,
    schema: {},
    async handler(ctx) {
      try {
        ctx.logger.info(`Running yarn install in ${ctx.workspacePath}`);

        const yarn = getYarnCommand(ctx);

        await executeShellCommand({
          command: yarn,
          args: ['install'],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        ctx.logger.info(`Done running yarn install`);
      } catch (err) {
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
