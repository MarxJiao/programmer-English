const TaskQueue = require('../lib/utils/TaskQueue');

describe('TaskQueue', () => {
  test('should run tasks with max concurrency', async () => {
    const queue = new TaskQueue(2);

    const tasks = [
      () => new Promise(resolve => setTimeout(() => resolve(1), 100)),
      () => new Promise(resolve => setTimeout(() => resolve(2), 50)),
      () => new Promise(resolve => setTimeout(() => resolve(3), 10)),
    ];

    const results = await queue.addTasks(tasks);
    expect(results).toEqual([1, 2, 3]);
  });

  test('should handle task rejections', async () => {
    const queue = new TaskQueue(1);
    const errorTask = () => new Promise((_, reject) => setTimeout(() => reject(new Error('Task failed')), 50));
    const successTask = () => new Promise(resolve => setTimeout(() => resolve('Task succeeded'), 10));

    await expect(queue.addTask(errorTask)).rejects.toThrow('Task failed');
    await expect(queue.addTask(successTask)).resolves.toBe('Task succeeded');
  });

  test('should run tasks in order', async () => {
    const queue = new TaskQueue(1);
    const results = [];
    const tasks = [
      () => new Promise(resolve => setTimeout(() => resolve(results.push(1)), 100)),
      () => new Promise(resolve => setTimeout(() => resolve(results.push(2)), 50)),
      () => new Promise(resolve => setTimeout(() => resolve(results.push(3)), 10)),
    ];

    await queue.addTasks(tasks);
    expect(results).toEqual([1, 2, 3]);
  });
});
