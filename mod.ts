import { TaskRunner, TaskDecorator } from "./runner.ts";

const globalRunner = new TaskRunner();

/** Define a task.
 *
 * ```
 * task("prepare", "echo preparing...");
 * task("counter", "deno counter.ts");
 * task("thumb", "deno https://deno.land/thumb.ts");
 * task("all", "$prepare", ["$counter alice", "$counter bob"], "$thumb");
 *             ^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^
 *             1st task    2nd task (parallel)                 3rd task
 * ```
 *
 * - Use $name to call other tasks. You can also pass arguments.
 * - Use array to run commands in parallel.
 *
 * Add file watcher. Usage is the same as https://github.com/jinjor/deno-watch.
 *
 * ```
 * task("compile", "echo changed", "$all").watchSync("src", options);
 * task("dev-server", "echo restarting...", "$server").watch("server");
 * ```
 *
 * - `watchSync` waits for running tasks, while `watch` does not.
 * - `watch` kills processes if they are running.
 */
export function task(
  name: string,
  ...rawCommands: (string | string[])[]
): TaskDecorator {
  return globalRunner.task(name, ...rawCommands);
}

new Promise(resolve => setTimeout(resolve, 0))
  .then(async () => {
    // Make the args var be like the previous format, which was a key value pair
    let parsedArgs: { [key: string]: any } = {}
    for (let i = 0; i < Deno.args.length; i = i + 2) {
      let tmpArg = Deno.args[i]
      tmpArg
        .replace('-', '')
        .replace('--', '')
      parsedArgs[tmpArg] = Deno.args[i + 1]
    }
    const cwd = parsedArgs.cwd || ".";
    const taskName = parsedArgs._[1];
    const taskArgs = parsedArgs._.splice(2);
    if (!taskName) {
      throw new Error("Usage: task_file.ts task_name [--cwd]");
    }
    await globalRunner.run(taskName, taskArgs, { cwd });
  })
  .catch(e => {
    console.error(e);
    Deno.exit(1);
  });
