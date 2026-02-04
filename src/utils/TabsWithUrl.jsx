import { useSearchParams } from "react-router-dom";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export function TabsWithUrl({ defaultValue, children }) {
  const [params, setParams] = useSearchParams();

  const activeTab = params.get("tab") || defaultValue;

  const handleTabChange = (value) => {
    const copy = new URLSearchParams(params);
    copy.set("tab", value);
    setParams(copy);
  };

  return (
    <TabsPrimitive.Root value={activeTab} onValueChange={handleTabChange}>
      {children}
    </TabsPrimitive.Root>
  );
}
