import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;
async function getHistoryPeriods(userId: string) {
  // prisma를 사용하여 데이터베이스에서 monthHistory 테이블에서
  // 여러 개의 레코드를 검색한다.
  const result = await prisma.monthHistory.findMany({
    where: {
      // userId가 주어진 값과 일치하는 행 검색
      userId,
    },
    // 결과로 가져올 열을 지정
    // 여기서는 year
    select: {
      year: true,
    },
    // 중복을 제거하기 위해 year 열에 대해 중복을 제거
    distinct: ["year"],
    // year 열을 기준으로 오름차순으로 결과 정렬
    orderBy: [
      {
        year: "asc",
      },
    ],
  });

  const years = result.map((el) => el.year);
  if (years.length === 0) {
    // Return the current year
    return [new Date().getFullYear()];
  }

  return years;
}
