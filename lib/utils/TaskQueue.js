class TaskQueue {
  constructor(maxConcurrency = 1) {
    this.maxConcurrency = maxConcurrency;
    this.runningCount = 0;
    this.queue = [];
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  addTasks(tasks) {
    return Promise.all(tasks.map(t => this.addTask(t)));
  }

  run() {
    while (this.runningCount < this.maxConcurrency && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      this.runningCount++;
      task()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.runningCount--;
          this.run();
        });
    }
  }
}

module.exports = TaskQueue;