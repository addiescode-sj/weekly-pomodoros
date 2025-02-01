import delay from "./delay";

describe("delay", () => {
  // delay 함수가 지정된 시간 후에 실행되는지 테스트
  it("should delay `func` execution", (done) => {
    let pass = false;
    // 32ms 후에 pass를 true로 변경하는 함수를 예약
    delay(() => {
      pass = true;
    }, 32);

    // 1ms 후에 pass가 아직 false인지 확인
    // (32ms가 지나지 않았으므로 delay 함수가 아직 실행되지 않았어야 함)
    setTimeout(() => {
      expect(pass).toBe(false);
    }, 1);

    // 64ms 후에 pass가 true인지 확인
    // (32ms가 충분히 지났으므로 delay 함수가 실행되었어야 함)
    setTimeout(() => {
      expect(pass).toBe(true);
      done();
    }, 64);
  });

  // wait 파라미터의 기본값(0)이 제대로 동작하는지 테스트
  it("should use a default `wait` of `0`", (done) => {
    let pass = false;
    // wait 파라미터를 생략하고 호출
    delay(() => {
      pass = true;
    });

    // 즉시 확인했을 때는 아직 false여야 함
    expect(pass).toBe(false);

    // 다음 틱(0ms)에 실행되었는지 확인
    setTimeout(() => {
      expect(pass);
      done();
    }, 0);
  });

  // clearTimeout으로 취소 가능한지 테스트
  it("should be cancelable", (done) => {
    let pass = true;
    // 32ms 후에 pass를 false로 변경하는 함수를 예약
    const timerId = delay(() => {
      pass = false;
    }, 32);

    // 예약된 함수를 즉시 취소
    clearTimeout(timerId);

    // 64ms 후에 확인했을 때 pass가 여전히 true인지 확인
    // (취소되었으므로 pass가 false로 변경되지 않았어야 함)
    setTimeout(() => {
      expect(pass);
      done();
    }, 64);
  });

  // 추가 인자가 제대로 전달되는지 테스트
  it("should provide additional arguments to `func`", (done) => {
    // jest의 mock 함수를 생성
    const mockFn = jest.fn();

    // delay 함수 호출 시 추가 인자(1, 2)를 전달
    delay(mockFn, 32, 1, 2);

    // 64ms 후에 mock 함수가 전달된 인자(1, 2)와 함께 호출되었는지 확인
    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledWith(1, 2);
      done();
    }, 64);
  });
});
