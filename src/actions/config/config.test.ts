import { PassThrough } from "stream";
import { createYarnConfigAction } from "./config";
import { getVoidLogger } from "@backstage/backend-common";
import { executeShellCommand } from "@backstage/plugin-scaffolder-node";

jest.mock("@backstage/plugin-scaffolder-node", () => ({
  ...jest.requireActual("@backstage/plugin-scaffolder-node"),
  executeShellCommand: jest.fn(),
}));

describe("yarn:exec", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call action", async () => {
    const action = createYarnConfigAction();

    const logger = getVoidLogger();

    await action.handler({
      input: { arguments: [] },
      workspacePath: "/tmp",
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        throw new Error("Not implemented");
      },
    });

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: expect.stringContaining("yarn"),
        args: expect.arrayContaining(["config"]),
      })
    );
  });

  it("should call action with given arguments", async () => {
    const action = createYarnConfigAction();

    const logger = getVoidLogger();

    const mockArgs = ["one", "two", "three"];

    await action.handler({
      input: { arguments: mockArgs },
      workspacePath: "/tmp",
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        throw new Error("Not implemented");
      },
    });

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: expect.stringContaining("yarn"),
        args: expect.arrayContaining(["config", ...mockArgs]),
      })
    );
  });
});
