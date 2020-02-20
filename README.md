# deno-task-runner-v2

[![Build Status](https://travis-ci.org/jinjor/deno-task-runner.svg?branch=master)](https://travis-ci.org/jinjor/deno-task-runner)
[![Build status](https://ci.appveyor.com/api/projects/status/6kbm7dxgsk7x6wl0?svg=true)](https://ci.appveyor.com/project/jinjor/deno-task-runner)

**I have done none of the work for this project. It was created and developed here: https://github.com/jinjor/deno-task-runner. I only fixed a few issues**

Write tasks in deno.

## Example

```typescript
// example.ts
import { task } from "https://deno.land/x/task_runner_v2/mod.ts";

task("prepare", "echo preparing...");
//    ^^^^^^^    ^^^^^^^^^^^^^^^^^
//   task name     task command
task("server", "deno --allow-net ... app.ts");
task("all", "$prepare", "$server");
//          ^^^^^^^^^^  ^^^^^^^^
//          1st task    2nd task
```

```
$ deno --allow-run --allow-env example.ts all
preparing...

Deno server started at localhost:1337.

^C

$ deno --allow-run --allow-env example.ts prepare
preparing...

$
```

## Watch
**Watching is currently under investigation to get working - the documentation is wrong and will not work**

```typescript
task("compile", "echo changed", "$all").watchSync("src");
task("dev-server", "echo restarting...", "$server").watch("server");
```

## LICENSE

MIT
