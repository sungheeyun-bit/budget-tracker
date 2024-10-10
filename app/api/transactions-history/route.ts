import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // safeParse는 유효성 검사가 추가된 데이터 구조를 파싱하는 함수이다.
  // safeParse 함수는 주어진 데이터 구조에 대해 입력 값을 검증하고, 유효한지 여부를 확인한다.
  // 만약 입력 값이 유효하면 해당 값으로 구조화된 객체를 반환하고,
  // 그렇지 않으면 오류를 반환한다.
  const qeuryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!qeuryParams.success) {
    return Response.json(qeuryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(
    user.id,
    qeuryParams.data.from,
    qeuryParams.data.to
  );

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  // findUnique() 를 사용하여 주어진 사용자 id에 해당하는 사용자 설정을 가지고온다.
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  if (!userSettings) {
    throw new Error("user settings not found");
  }

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    // lets format the amount with the user currency
    formattedAmount: formatter.format(transaction.amount),
  }));
}
