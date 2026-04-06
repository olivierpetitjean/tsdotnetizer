/**
 * Tests for diagnostics utilities
 */

import { describe, it, expect } from 'vitest';
import { StopWatch } from '../../src/diagnostics';

describe('StopWatch', () => {
  it('should create stopped', () => {
    const sw = new StopWatch();
    expect(sw.isRunning).toBe(false);
    expect(sw.elapsedMilliseconds).toBe(0);
  });

  it('should start', () => {
    const sw = new StopWatch();
    sw.start();
    expect(sw.isRunning).toBe(true);
  });

  it('should stop', () => {
    const sw = new StopWatch();
    sw.start();
    sw.stop();
    expect(sw.isRunning).toBe(false);
  });

  it('should reset', () => {
    const sw = StopWatch.startNew();
    // Small delay
    const start = Date.now();
    while (Date.now() - start < 10) {
      // Wait
    }
    sw.stop();
    expect(sw.elapsedMilliseconds).toBeGreaterThan(0);
    sw.reset();
    expect(sw.elapsedMilliseconds).toBe(0);
    expect(sw.isRunning).toBe(false);
  });

  it('should restart', async () => {
    const sw = StopWatch.startNew();
    await new Promise(resolve => setTimeout(resolve, 50));
    sw.stop();
    const elapsed = sw.elapsedMilliseconds;
    expect(elapsed).toBeGreaterThanOrEqual(40);
    sw.restart();
    expect(sw.isRunning).toBe(true);
    // After restart, elapsed should have been reset to near 0, well below the previous elapsed
    expect(sw.elapsedMilliseconds).toBeLessThan(elapsed);
  });

  it('should startNew', () => {
    const sw = StopWatch.startNew();
    expect(sw.isRunning).toBe(true);
  });

  it('should measure elapsed time', async () => {
    const sw = StopWatch.startNew();
    await new Promise(resolve => setTimeout(resolve, 50));
    sw.stop();
    expect(sw.elapsedMilliseconds).toBeGreaterThanOrEqual(40);
  });

  it('should measure while running', async () => {
    const sw = StopWatch.startNew();
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(sw.elapsedMilliseconds).toBeGreaterThanOrEqual(40);
    sw.stop();
  });

  it('should measure function', () => {
    const [result, elapsed] = StopWatch.measure(() => {
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      return sum;
    });
    expect(typeof result).toBe('number');
    expect(typeof elapsed).toBe('number');
    expect(elapsed).toBeGreaterThanOrEqual(0);
  });

  it('should measure async function', async () => {
    const [result, elapsed] = await StopWatch.measureAsync(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return 'done';
    });
    expect(result).toBe('done');
    expect(elapsed).toBeGreaterThanOrEqual(40);
  });

  it('should get elapsed seconds', () => {
    const sw = StopWatch.startNew();
    sw.stop();
    expect(sw.elapsedSeconds).toBe(sw.elapsedMilliseconds / 1000);
  });
});
