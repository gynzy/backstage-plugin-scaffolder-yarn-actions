import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { getYarnCommand } from "../../utils/getYarnCommand";

export function createYarnConfigAction() {
  return createTemplateAction<{ arguments: string[] }>({
    id: "yarn:config",
    description:
      "Runs yarn config with the given arguments in the task workspace directory",
    supportsDryRun: true,
    schema: {
      input: {
        type: "object",
        required: ["arguments"],
        properties: {
          arguments: {
            title: "Arguments",
            description: "The arguments to pass to the yarn config command",
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },
    async handler(ctx) {
      try {
        ctx.logger.info(`Running yarn config in ${ctx.workspacePath}`);
        ctx.logger.info(`Input: ${ctx.input.arguments}`);

        const yarn = getYarnCommand(ctx);

        await executeShellCommand({
          command: yarn,
          args: ["config", ...ctx.input.arguments],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        ctx.logger.info(`Done running yarn config`);
      } catch (err) {
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
