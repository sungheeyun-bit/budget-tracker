import { Currencies } from "./currencies";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

export function GetFormatterForCurrency(currency: string) {
  const locale = Currencies.find((c) => c.value === currency)?.locale;

  // Intl는 자바스크립트 내장 객체 중 하나로, 국제화 관련 기능을 제공한다.
  // 이 객체는 다국어 및 다국적 환경에서 사용자의 지역 설정에 맞는 문자열, 숫자, 날짜 및 시간 형식을 제어하는 데 사용된다.
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
