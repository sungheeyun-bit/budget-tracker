import { z } from "zod";

// z.object() 함수를 사용하여 객체 스키마를 정의한다.
// 이 객체 스키마는 트랜잭션 생성에 필요한 다양한 속성을 포함한다.
export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

// infer 키워드는 Zod 스키마에서 TypeScript 유형을 추론하는 데 사용되며,
// 정의된 스키마에 따라 객체를 검사할 때 유용하다.
// TypeScript에서는 'typeof' 연산자를 사용하여 변수의 유형을 가져올 수 있지만
// Zod 스키마는 제네릭 유형이기 때문에 'typeof'로 직접 유형을 가져올 수 없다.
// 이때 'infer'키워드를 사용하여 Zod 스키마에서 유형을 추론한다.
export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
