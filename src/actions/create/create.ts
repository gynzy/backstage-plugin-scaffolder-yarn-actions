import {
  createTemplateAction,
  executeShellCommand,
} from '@backstage/plugin-scaffolder-node';
import { getYarnCommand } from '../../utils/getYarnCommand';

export function createYarnCreateAction() {
  return createTemplateAction<{}>({
    id: 'yarn:create',
    description:
      'Runs yarn create with defaults set in the task workspace directory',

    async handler(ctx) {
      try {
        ctx.logger.info(`Running yarn create in ${ctx.workspacePath}`);

        const yarn = getYarnCommand(ctx);

        await executeShellCommand({
          command: yarn,
          args: ['create'],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        ctx.logger.info(`Done running yarn create`);
      } catch (err) {
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
