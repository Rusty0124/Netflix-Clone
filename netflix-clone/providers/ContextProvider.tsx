"use client";

import { GlobalProvider } from "@/context/globalContext";
import { ProfileProvider } from "@/context/profileContext";
import { Tooltip } from "radix-ui";

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <ProfileProvider>
        <Tooltip.Provider>{children}</Tooltip.Provider>
      </ProfileProvider>
    </GlobalProvider>
  );
}
