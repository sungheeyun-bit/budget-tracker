import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });
  }

  // Revalidate the home page that uses the user currency
  // revalidatePath 함수를 사용하면 지정된 경로의 페이지 캐시를 재검증하여
  // 새로운 데이터를 가져와서 캐시를 업데이트할 수 있다.
  // 일반적으로 이 함수는 데이터가 변경될 때마다 호출되어 해당 경로의 페이지를 업데이트하는 데 사용된다.
  revalidatePath("/");
  // Response.json() 메서드는 서버에서 클라이언트로 JSON 형식의 데이터를 반환하기 위한 것.
  // HTTP 응답을 JSON 형식으로 변환하여 클라이언트에게 전송한다.
  return Response.json(userSettings);
}
