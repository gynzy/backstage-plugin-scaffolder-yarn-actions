import {
  createTemplateAction,
  executeShellCommand,
} from '@backstage/plugin-scaffolder-node';
import { getYarnCommand } from '../../utils/getYarnCommand';

export function createYarnRunAction() {
  return createTemplateAction<{ arguments: string[] }>({
    id: 'yarn:run',
    description:
      'Runs yarn run with the given arguments in the task workspace directory',
    supportsDryRun: true,
    schema: {
      input: {
        type: 'object',
        required: ['arguments'],
        properties: {
          arguments: {
            title: 'Arguments',
            description: 'The arguments to pass to the yarn run command',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    async handler(ctx) {
      if (ctx.input.arguments.length === 0) {
        throw new Error('No arguments provided');
      }
      try {
        ctx.logger.info(`Running yarn run in ${ctx.workspacePath}`);
        ctx.logger.info(`Input: ${ctx.input.arguments}`);

        const yarn = getYarnCommand(ctx);

        await executeShellCommand({
          command: yarn,
          args: ['run', ...ctx.input.arguments],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        ctx.logger.info(`Done running yarn run`);
      } catch (err) {
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
