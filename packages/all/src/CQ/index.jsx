import "./index.css"

export function CQRow({ children, columns = 12, gap = "1rem", className, style, ...rest }) {
    return (
        <div
            className={["cq-row", className].filter(Boolean).join(" ")}
            style={{ "--cols": columns, "--gap": gap, ...style }}
            {...rest}
        >
            {children}
        </div>
    );
}

export function CQCol({ children, xs = 12, sm, md, lg, xl, className, style, ...rest }) {
    const cssVars = {
        "--span-xs": xs,
        ...(sm != null ? { "--span-sm": sm } : {}),
        ...(md != null ? { "--span-md": md } : {}),
        ...(lg != null ? { "--span-lg": lg } : {}),
        ...(xl != null ? { "--span-xl": xl } : {}),
    };
    return (
        <div
            className={["cq-col", className].filter(Boolean).join(" ")}
            style={{ ...cssVars, ...style }}
            {...rest}
        >
            {children}
        </div>
    );
}
