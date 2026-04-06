/**
 * Diagnostics utilities
 */

/**
 * Provides a set of methods for measuring elapsed time.
 */
export class StopWatch {
  private _startTime = 0;
  private _elapsedMilliseconds = 0;
  private _isRunning = false;

  /**
   * Creates a new StopWatch.
   */
  constructor() {
    this.reset();
  }

  /**
   * Gets the total elapsed time in milliseconds.
   */
  get elapsedMilliseconds(): number {
    if (this._isRunning) {
      return this._elapsedMilliseconds + (Date.now() - this._startTime);
    }
    return this._elapsedMilliseconds;
  }

  /**
   * Gets the total elapsed time in seconds.
   */
  get elapsedSeconds(): number {
    return this.elapsedMilliseconds / 1000;
  }

  /**
   * Gets a value indicating whether the stopwatch is running.
   */
  get isRunning(): boolean {
    return this._isRunning;
  }

  /**
   * Starts measuring time.
   */
  start(): void {
    if (!this._isRunning) {
      this._startTime = Date.now();
      this._isRunning = true;
    }
  }

  /**
   * Stops measuring time.
   */
  stop(): void {
    if (this._isRunning) {
      this._elapsedMilliseconds += Date.now() - this._startTime;
      this._isRunning = false;
    }
  }

  /**
   * Resets the stopwatch.
   */
  reset(): void {
    this._elapsedMilliseconds = 0;
    this._isRunning = false;
    this._startTime = 0;
  }

  /**
   * Stops and resets the stopwatch.
   */
  restart(): void {
    this.reset();
    this.start();
  }

  /**
   * Creates and starts a new StopWatch.
   * @returns A running StopWatch.
   */
  static startNew(): StopWatch {
    const sw = new StopWatch();
    sw.start();
    return sw;
  }

  /**
   * Measures the time to execute a function.
   * @template T The return type.
   * @param fn The function.
   * @returns A tuple [result, elapsedMilliseconds].
   */
  static measure<T>(fn: () => T): [T, number] {
    const sw = StopWatch.startNew();
    const result = fn();
    sw.stop();
    return [result, sw.elapsedMilliseconds];
  }

  /**
   * Measures the time to execute an async function.
   * @template T The return type.
   * @param fn The async function.
   * @returns A promise of [result, elapsedMilliseconds].
   */
  static async measureAsync<T>(fn: () => Promise<T>): Promise<[T, number]> {
    const sw = StopWatch.startNew();
    const result = await fn();
    sw.stop();
    return [result, sw.elapsedMilliseconds];
  }
}
