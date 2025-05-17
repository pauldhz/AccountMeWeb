export class TestUtils {
  /**
   * Compare if elements of "compare" contains the "expected" values
   *
   * @param compare Element of comparison
   * @param expected values expected
   * @return missing expectations.
   */
  public static containsAll<T>(compare: T[], expected: T[]): T[] {
    const missingExpectations: T[] = [];
    expected.forEach(expectation => {
      if(!compare.includes(expectation)) {
        missingExpectations.push(expectation);
      }
    });
    return missingExpectations;
  }
}
