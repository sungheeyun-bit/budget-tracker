"use client";

import { ThemeProvider } from "next-themes";
import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function RootProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        // 테마가 변경될 때 class 속성을 변경하여 다양한 테마에 대한 스타일을 적용할 수 있도록 한다.
        attribute="class"
        // 기본 테마 지정
        defaultTheme="dark"
        // 시스템 테마를 사용하여 애플리케이션의 테마를 설정
        enableSystem
        // 테마가 변경될 때 애니메이션 효과 없음
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default RootProviders;
