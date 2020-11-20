/**
 * Resove in the given number of milliseconds
 *
 * @param ms wait time in milliseconds
 */
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fake Http service
 */
export class Http {
  constructor(private simulatedDelayMs = 1000) {}

  get = (url: string, params?: any) =>
    wait(this.simulatedDelayMs).then(() => ({ url, params }));
}

export default new Http();
