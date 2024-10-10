import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Next.js에서 서버 측 라우팅을 처리하는 함수
// request 객체를 통해 URL의 쿼리 매개변수를 분석하고 유효성을 검사한다.
export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // 요청 객체의 URL을 사용하여 URL의 쿼리 매개변수를 가져온다.
  // new URL(request.url)을 사용하여 URL을 파싱하고,
  // searchParams를 통해 쿼리 매개변수를 가져온다.
  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  // 유효성 검사를 위해 zod 라이브러리 사용
  // nullable()메서드를 통해 null 값도 허용한다는 의미
  // 즉, 쿼리 매개변수가 없거나 null인 경우에도 유효성 검사를 통과할 수 있다.
  const validator = z.enum(["expense", "income"]).nullable();
  // validator.safeParse()을 사용하여 실제 쿼리 매개변수 값의 유효성 검사
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // include type in the filters if it's defined.
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}
