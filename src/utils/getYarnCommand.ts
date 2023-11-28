import { ActionContext } from '@backstage/plugin-scaffolder-node';

export const getYarnCommand = (ctx: ActionContext<any>) => {
  const yarn = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

  ctx.logger.info(
    `OS platform is ${process.platform}, using '${yarn}' as command`,
  );

  return yarn;
};
