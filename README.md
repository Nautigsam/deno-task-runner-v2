# deno-task-runner-v2

[![Build Status](https://travis-ci.org/jinjor/deno-task-runner.svg?branch=master)](https://travis-ci.org/jinjor/deno-task-runner)
[![Build status](https://ci.appveyor.com/api/projects/status/6kbm7dxgsk7x6wl0?svg=true)](https://ci.appveyor.com/project/jinjor/deno-task-runner)

**I have done none of the work for this project. It was created and developed here: https://github.com/jinjor/deno-task-runner. I only fixed a few issues**

Write tasks in deno.

## Example

Create your server file. We are using [Drash]() to quickly set up a server, mainly because it's super easy and it allows us to demonstrate the usage of tasks as well as the usage of watching

```typescript
// test-server.ts
import Drash from "https://deno.land/x/drash/mod.ts";
const server = new Drash.Http.Server({
    address: 'localhost:1667'
})
server.run()
```

Now lets create our task file that will run the server and watch for changes - restarting if a change is detected

```typescript
// tasks.ts
import { task } from "https://deno.land/x/task_runner_v2@master/mod.ts";

// A task is defined like so:
// task('say-hello', 'echo hello', 'echo world', ...)
//        ^^^^^^^      ^^^^^^        ^^^^^^^^
//       task name    1st task       2nd task

// To call tasks from another task, we use their name and prefix it with "$":
// task('run-say-hello', $say-hello')

// Create our real tasks
task("prepare", "echo preparing...");
task("server", "deno --allow-read --allow-run --allow-net --allow-env test-server.ts");
task("all", "$prepare", "$server");
task("watch", "echo restarting...", "$server").watch("test-server.ts");
// or
task('watch', ..., ...).watch('./src') // for directories
```

Run the task file to start the server (run a task) and watch for changes:

**(Note: There is currently a bug when the task detects a change and restarts, and is being investigated. There is also a problem when the watched file or dir is the current working directory e.g `watch('.')`)**

```
$ deno --allow-read --allow-env --allow-run .\tasks.ts watch
restarting...

Deno server started at localhost:1667.
```

Whilst the server is running, make a change to `test-server.ts`. for example adding `console.log('Hello')` and watch the server restart.

You choose which task to run:

```
$ deno --allow-env --allow-run .\init.ts prepare
preparing...

$ deno --allow-read --allow-env --allow-run .\init.ts all
preparing...

Deno server started at localhost:1667.
```

## LICENSE

MIT
