import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});


// 왜 typeof가 필요한가
// 1. 타입 안전성 : zob 스키마로 정의된 데이터 구조와 일치하는 타입스크립트 타입을 자동으로 생성
// 2. 유지보수 용이성 : 스키마를 변경할때마다 타입을 수동으로 수정할 필요 없이 자동으로 타입 추출
// 3. 코드 간소화 : 명확하고 간결한 코드 작성 
export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

export const DeleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(["income", "expense"]),
});

export type DeleteCategorySchemaType = z.infer<typeof DeleteCategorySchema>;
