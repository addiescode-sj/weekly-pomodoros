import slice from "./slice";

// slice 함수에 대한 테스트 묶음 (그룹)
describe("slice", () => {
  // 테스트에 사용할 기본 배열
  const array = [1, 2, 3];

  // 기본 파라미터가 잘 동작하는지 테스트
  it("should use a default `start` of `0` and a default `end` of `length`", () => {
    // start와 end를 지정하지 않았을 때 전체 배열을 복사하는지 확인
    const actual = slice(array);
    expect(actual).toEqual(array); // 값이 동일한지 확인
    expect(actual).not.toBe(array); // 새로운 배열이 생성되었는지 확인 (참조가 다른지)
  });

  // 양수 시작 인덱스 테스트
  it("should work with a positive `start`", () => {
    // start만 지정한 경우
    expect(slice(array, 1)).toEqual([2, 3]);
    // start와 end 모두 지정한 경우
    expect(slice(array, 1, 3)).toEqual([2, 3]);
  });

  // 배열 길이보다 크거나 같은 시작 인덱스 테스트
  it.each([3, 4, 2 ** 32, Infinity])(
    "should work with a `start` >= `length`",
    (start) => {
      // 시작 인덱스가 배열 길이 이상이면 빈 배열 반환
      expect(slice(array, start)).toEqual([]);
    }
  );

  // 음수 시작 인덱스 테스트
  it("should work with a negative `start`", () => {
    // 끝에서부터 역으로 계산 (-1은 마지막 요소부터)
    expect(slice(array, -1)).toEqual([3]);
  });

  // 배열 길이의 음수보다 작거나 같은 시작 인덱스 테스트
  it.each([-3, -4, -Infinity])(
    "should work with a negative `start` <= negative `length`",
    (start) => {
      // 음수 시작 인덱스가 배열 길이보다 작으면 전체 배열 반환
      expect(slice(array, start)).toEqual(array);
    }
  );

  // 시작 인덱스가 끝 인덱스보다 크거나 같은 경우 테스트
  /**
   * each는 배열의 각 요소를 가지고 동일한 테스트를 반복 실행하는 방식
   * 즉, [2, 3] 배열의 각 값이 차례대로 start 파라미터로 전달됩니다
   * 예를 들어 start = 2일 때: expect(slice(array, 2, 2)).toEqual([]);
   */
  it.each([2, 3])("should work with `start` >= `end`", (start) => {
    // 시작이 끝보다 크거나 같으면 빈 배열 반환
    expect(slice(array, start, 2)).toEqual([]);
  });

  // 양수 끝 인덱스 테스트
  it("should work with a positive `end`", () => {
    // 0부터 1(미포함)까지 자르기
    expect(slice(array, 0, 1)).toEqual([1]);
  });

  // 배열 길이보다 크거나 같은 끝 인덱스 테스트
  it.each([3, 4, 2 ** 32, Infinity])(
    "should work with a `end` >= `length`",
    (end) => {
      // 끝 인덱스가 배열 길이 이상이면 전체 배열 반환
      expect(slice(array, 0, end)).toEqual(array);
    }
  );

  // 음수 끝 인덱스 테스트
  it("should work with a negative `end`", () => {
    // 끝에서부터 역으로 계산 (-1은 마지막 요소 제외)
    expect(slice(array, 0, -1)).toEqual([1, 2]);
  });

  // 배열 길이의 음수보다 작거나 같은 끝 인덱스 테스트
  it.each([-3, -4, -Infinity])(
    "should work with a negative `end` <= negative `length`",
    (end) => {
      // 음수 끝 인덱스가 배열 길이보다 작으면 빈 배열 반환
      expect(slice(array, 0, end)).toEqual([]);
    }
  );
});
