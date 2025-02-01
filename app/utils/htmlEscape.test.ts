import { escape, unescape } from "./htmlEscape";

// escape 함수 테스트 수트
describe("escape", () => {
  /* 테스트에 사용할 기본 문자열
  escaped: HTML 엔터티로 이스케이프된 특수 문자들
  unescaped: 이스케이프되지 않은 원본 특수 문자들
  */

  let escaped = "&amp;&lt;&gt;&quot;&#39;/";
  let unescaped = "&<>\"'/";

  // 팁: 테스트 문자열을 두 배로 늘려서 복잡한 케이스도 테스트
  escaped += escaped;
  unescaped += unescaped;

  // 기본적인 이스케이프 동작 테스트
  // 특수 문자들이 올바른 HTML 엔터티로 변환되는지 확인
  it("should escape values", () => {
    expect(escape(unescaped)).toBe(escaped);
  });

  // 이스케이프가 필요없는 일반 문자열 처리 테스트
  // 일반 문자열은 변환없이 그대로 반환되어야 함
  it("should handle strings with nothing to escape", () => {
    expect(escape("abc")).toBe("abc");
  });

  // escape와 unescape 함수의 호환성 테스트
  // unescape된 문자열을 다시 escape했을 때 원래의 이스케이프된 문자열과 일치해야 함
  it("should escape the same characters unescaped by `_.unescape`", () => {
    expect(escape(unescape(escaped))).toBe(escaped);
  });

  // 이스케이프하지 말아야 할 특수 문자 테스트
  // 백틱(`)과 슬래시(/)는 이스케이프되지 않고 그대로 유지되어야 함
  ["`", "/"].forEach((chr) => {
    it(`should not escape the "${chr}" character`, () => {
      expect(escape(chr)).toBe(chr);
    });
  });
});

// unescape 함수 테스트 수트
describe("unescape", () => {
  // 테스트에 사용할 기본 문자열 설정
  // escaped: HTML 엔터티로 이스케이프된 특수 문자들
  // unescaped: 이스케이프되지 않은 원본 특수 문자들
  let escaped = "&amp;&lt;&gt;&quot;&#39;/";
  let unescaped = "&<>\"'/";

  // 팁: 테스트 문자열을 두 배로 늘려서 복잡한 케이스도 테스트
  escaped += escaped;
  unescaped += unescaped;

  // 중첩된 엔터티 처리 테스트
  // &amp;lt;는 &lt;로 변환되어야 함 (순차적 처리 확인)
  it("should unescape entities in order", () => {
    expect(unescape("&amp;lt;")).toBe("&lt;");
  });

  // 기본적인 언이스케이프 동작 테스트
  // HTML Entities가 올바른 특수 문자로 변환되는지 확인
  it("should unescape the proper entities", () => {
    expect(unescape(escaped)).toBe(unescaped);
  });

  // 언이스케이프가 필요없는 일반 문자열 처리 테스트
  // 일반 문자열은 변환없이 그대로 반환되어야 함 !
  it("should handle strings with nothing to unescape", () => {
    expect(unescape("abc")).toBe("abc");
  });

  // escape와 unescape 함수의 호환성 테스트
  // escape된 문자열을 다시 unescape했을 때 원래 문자열과 일치해야 함
  it("should unescape the same characters escaped by `_.escape`", () => {
    expect(unescape(escape(unescaped))).toBe(unescaped);
  });

  // HTML 엔터티의 선행 제로 처리 테스트
  // &#39;, &#039;, &#000039; 모두 작은따옴표(')로 변환되어야 함
  it("should handle leading zeros in html entities", () => {
    expect(unescape("&#39;")).toBe("'");
    expect(unescape("&#039;")).toBe("'");
    expect(unescape("&#000039;")).toBe("'");
  });

  // 언이스케이프하지 말아야 할 엔터티 테스트
  // 백틱(&#96;)과 슬래시(&#x2F;)는 변환되지 않고 그대로 유지되어야 함
  ["&#96;", "&#x2F;"].forEach((entity) => {
    it(`should not unescape the "${entity}" entity`, () => {
      expect(unescape(entity)).toBe(entity);
    });
  });
});
