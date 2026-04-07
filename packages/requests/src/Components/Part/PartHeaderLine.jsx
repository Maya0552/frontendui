import { useState } from "react";

const styles = {
    textDividerContainer: {
        display: "flex",
        alignItems: "center",
        color: "#6c757d",
        textTransform: "uppercase",
        fontSize: "0.85rem",
        fontWeight: "bold",
        letterSpacing: "0.05em",
        marginTop: "1.5rem",
        marginBottom: "1.5rem",
        // zIndex: 10
        // width: "100%"
    },
    textDividerLine: {
        flex: 1,
        borderTop: "2px solid #6c757d",
        opacity: 0.7,
    },
    editableText: {
        margin: "0 0.5rem",
        cursor: "pointer",
    },
    inputField: {
        margin: "0 0.5rem",
        fontSize: "0.85rem",
        textTransform: "uppercase",
        fontWeight: "bold",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "2px 4px",
    },
};

export const PartHeaderLine = ({ part, onNameChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(part.name || "Část");

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setName(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (onNameChange) onNameChange(name); // Notify parent of the name change
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            if (onNameChange) onNameChange(name);
        }
    };

    return (
        <div style={styles.textDividerContainer}>
            <div style={styles.textDividerLine}></div>
            {isEditing ? (
                <input
                    type="text"
                    value={name}
                    autoFocus
                    style={styles.inputField}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress}
                />
            ) : (
                <span style={styles.editableText} onClick={handleEditClick}>
                    {name}
                </span>
            )}
            <div style={styles.textDividerLine}></div>
        </div>
    );
};


export const HorizontalLine = ({children}) => {
    return (
        // <div style={{"width": "100%"}}>
        <div style={styles.textDividerContainer}>
            <div style={styles.textDividerLine}></div>
            <span style={{"margin": "0 0.5rem"}}>{children}</span>
            <div style={styles.textDividerLine}></div>
        </div>
        // </div>
    )
}

export const PartHeaderLineView = ({ part }) => {
    return (
        <HorizontalLine>
            {part.name || "Část"}
        </HorizontalLine>
    );
};
