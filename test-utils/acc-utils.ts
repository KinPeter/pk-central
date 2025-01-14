export let testOrder = Promise.resolve();

type TestFunction = () => Promise<void>;

export const runSequentially = (func: TestFunction) => {
  return async () => {
    await testOrder;
    testOrder = func();
    await testOrder;
  };
};

export function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.TOKEN}`,
  };
}
