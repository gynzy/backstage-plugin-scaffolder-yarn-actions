# backstage-plugin-scaffolder-yarn-actions package

This is a `yarn` actions plugin for the `scaffolder-backend` in Backstage.

This contains a collection of actions for using with yarn:

- yarn:add
- yarn:config
- yarn:create
- yarn:install
- yarn:run

## Prerequisites

- Node and yarn must be installed in the environment your Backstage instance is running in, but it will most likely already be there since your Backstage instance runs in Node.

## Getting started

In the root directory of your Backstage project:

```
yarn add --cwd packages/backend @gynzy/backstage-plugin-scaffolder-yarn-actions
```

Add the actions you'd like to the scaffolder:

```typescript
// packages/backend/src/plugins/scaffolder.ts

import {
  createYarnAddAction,
  createYarnConfigAction,
  createYarnCreateAction,
  createYarnInstallAction,
  createYarnRunAction,
} from '@gynzy/backstage-plugin-scaffolder-yarn-actions';
import { ScmIntegrations } from '@backstage/integration';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';

...

const integrations = ScmIntegrations.fromConfig(env.config);
const builtInActions = createBuiltinActions({
  catalogClient,
  integrations,
  config: env.config,
  reader: env.reader
});

const actions = [
    createYarnAddAction(),
    createYarnConfigAction(),
    createYarnCreateAction(),
    createYarnInstallAction(),
    createYarnRunAction(),
  ...builtInActions
];

return await createRouter({
  logger: env.logger,
  config: env.config,
  database: env.database,
  reader: env.reader,
  catalogClient,
  actions
});
```

## Example of using each of the three actions:

```yaml
---
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: yarn-demo
  title: My yarn demo template
  description: Run yarn commands in the task's working directory
spec:
  owner: developers
  type: service

  parameters:
    - title: Yarn add
      properties:
        packageToInstall:
          title: Package to install
          type: string
          description: The name of the yarn package to install
        runArgs:
          title: Args for yarn run
          type: array
          description: Command and arguments to pass to yarn run

  steps:
    - id: yarn-create
      name: create
      action: yarn:create

    - id: yarn-add
      name: add
      action: yarn:add
      input:
        packageToInstall: ${{ parameters.packageToInstall }}

    - id: yarn-run
      name: run
      action: yarn:run
      input:
        args: ${{ parameters.runArgs }}
```
