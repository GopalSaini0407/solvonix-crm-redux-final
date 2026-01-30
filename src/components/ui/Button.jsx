import React from "react";

function Button() {
  return (
    <>
     {/* <button className="bg-[var(--color-primary)] text-[var(--color-text)] px-4 py-2 rounded">
  Click
</button>
  
  <button className="bg-[var(--color-primary)] text-[var(--color-text)] border border-[var(--color-text)] px-4 py-2 rounded">
  Click Me
</button> */}
<div className="p-6 rounded-xl bg-(--color-surface) border border-(--color-text) shadow-md max-w-sm">
      
      <h2 className="text-2xl font-bold text-(--color-text) mb-2">
        Theme Based Card
      </h2>

      <p className="text-(--color-text) mb-4">
        This card automatically adapts its colors based on the active theme. No hardcoded colors!
      </p>

      <button className="px-4 py-2 rounded bg-(--color-primary) text-(--color-bg) border border-(--color-text)">
        Action
      </button>
    </div>

    </>
 

  );
}

export default Button;
