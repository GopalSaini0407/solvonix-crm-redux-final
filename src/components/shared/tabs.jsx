import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={`flex ${className}`}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={`px-2 py-2 text-sm cursor-pointer rounded  text-(--color-nav-active-bg)
    data-[state=active]:bg-(--color-nav-active-bg) data-[state=active]:font-semibold
   data-[state=active]:text-(--color-nav-hover-text)
    ${className}`}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={`${className}`}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
