# deno-task-runner-v2

[![Build Status](https://travis-ci.org/jinjor/deno-task-runner.svg?branch=master)](https://travis-ci.org/jinjor/deno-task-runner)
[![Build status](https://ci.appveyor.com/api/projects/status/6kbm7dxgsk7x6wl0?svg=true)](https://ci.appveyor.com/project/jinjor/deno-task-runner)

**I have done none of the work for this project. It was created and developed here: https://github.com/jinjor/deno-task-runner. I only fixed a few issues**

Write tasks in deno.

# Examples

## Run Tasks

Create your tasks file:

```typescript
// tasks.ts
import { task } from "https://deno.land/x/task_runner_v2@master/mod.ts";

// A task is defined like so:
// task('say-hello', 'echo hello', 'echo world', ...)
//        ^^^^^^^      ^^^^^^        ^^^^^^^^
//       task name    1st task       2nd task

// To call tasks from another task, we use their name and prefix it with "$":
// task('run-say-hello', '$say-hello')

// Create our real tasks
task("prepare", "echo preparing...");
task("say-hello", "echo hello");
task("all", "$prepare", "$say-hello");
```

Now you can choose which tasks to run, running `all` will run the `prepare` task, then the `say-hello` task, where as running `say-hello` will only echo `hello`:

```
$ deno --allow-env --allow-run tasks.ts all
preparing...
hello

$ deno tasks.ts say-hello
hello

$
```

## Watching for Changes

There are two ways to watch: `watch` and `watchSync`.

* `watch`
    This, when detecting a change, will kill the process running and re run it's defined tasks
    
* `watchSync`
    This, when detecting a change, will wait for the running tasks to finish before re-running them
    
For when you are running a server and wish to watch for changes, `watch` should be used as `watchSync` will not work here, due to the running process continually running, thus the tasks never finish and it won't re-run the tasks.

Watching as a functionality, will take control of the console.

Here are some examples:

* `watch`

Create your 'server' file (so it can take control of the console as if it was a running process:

```
// test-server.ts
const number = Math.floor(Math.random() * 1000);
setInterval(() => {
  console.log(`${number} running...`);
}, 600);
```

Create your task to run it and watch for changes:

```
// tasks.ts
import { task } from "https://deno.land/x/task_runner_v2@master/mod.ts";
task("server", "deno test-server.ts");
task("start", "echo restarting...", "$server").watch("."); // re runs the `start` task upon a change
```

**Note: specifying `.` as the area to watch does not work, and also errors when a file changes and the task restarts**

Run the server and watch:

```
$ deno --allow-env --allow-run --allow-read tasks.ts start
restarting...
* running...
* running...
```

Then make a change to the 'server' file and watch the console

* `watchSync`

Create a counter file:

```
// counter.ts
const name = Deno.args[1] || ""; // args is passed in by the task
let i = 0;
const interval = setInterval(() => {
  console.log(Deno.args[0], ++i);
  if (i >= 5) {
    clearInterval(interval);
  }
}, 600);
```

Create your task file:

```
// tasks.ts
import { task } from "https://deno.land/x/task_runner_v2@master/mod.ts";
task("counter", "deno counter.ts");
task("all", ["$counter alice", "$counter bob"]);
task("start", "echo changed", "$all").watchSync("."); // re runs the `start` task upon a change
```

**Note: all the tasks are finished, this is when the watchSync starts watching which errors**

Run your task and watch:

```
$ deno --allow-env --allow-run --allow-read tasks.ts start
changed
alice 1
bob 1
...
```

Whilst this process is still running (as it will because we have the `watchSync`), make a change somewhere and watch your console return the tasks.

## LICENSE

MIT
