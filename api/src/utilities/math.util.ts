export class MathUtil {
  public countPrimesByTrialDivision({ n }: { n: number }): number {
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      throw new Error("n must be a finite integer");
    }
    if (n < 2) return 0;

    let count = 0;
    for (let i = 2; i <= n; i += 1) {
      if (this.isPrimeTrialDivision(i)) count += 1;
    }
    return count;
  }

  public fibonacciRecursive(n: number): number {
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      throw new Error("n must be a finite integer");
    }
    if (n < 0) {
      throw new Error("n must be non-negative");
    }
    if (n < 2) return n;
    return this.fibonacciRecursive(n - 1) + this.fibonacciRecursive(n - 2);
  }

  private isPrimeTrialDivision(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    const max = globalThis.Math.floor(globalThis.Math.sqrt(n));
    for (let d = 3; d <= max; d += 2) {
      if (n % d === 0) return false;
    }
    return true;
  }
}
