import { useState } from "react";

export default function RemoveButton({
    onClick,
    title="Remove",
    ariaLabel="Remove",
    size = 16,
    corner = false,
    style = {},
}) {
    const [hover, setHover] = useState(false);

    const diameter = size + 12;

    const btnStyle = {
        width: diameter,
        height: diameter,
        border: "none",
        borderRadius: "50%",
        background: hover ? "#990012ff" : "#0e0c0cff",
        color: "white",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        lineHeight: 1,
        ...(corner ? { position: "absolute", top: 8, right: 8 } : {}),
        ...style,
    };

    return (
        <button
            type="button"
            aria-label={ariaLabel}
            title={title}
            onClick={onClick}
            style={btnStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block"}}>
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        </button>
    )
}
