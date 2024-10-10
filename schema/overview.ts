import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const OverviewQuerySchema = z
  .object({
    // coerce는 Zod 스키마에서 값을 변환하는 메서드.
    // 이 메서드는 주어진 값이 지정된 유형으로 변환되도록 시도한다.
    // 즉 z.coerce.date()는 값을 날짜 형식으로 변환
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  // refine은 Zod 스키마에서 값을 추가로 검증하거나 조작하기 위해 사용되는 메서드.
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange;
  });
