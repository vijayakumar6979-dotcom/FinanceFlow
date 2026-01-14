import * as React from "react";

export function Button({ children }: { children: React.ReactNode }) {
    return <button className="bg-primary-500 text-white px-4 py-2 rounded">{children}</button>;
}
