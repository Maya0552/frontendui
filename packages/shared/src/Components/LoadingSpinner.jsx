import ReactDOM from "react-dom";

export const LoadingSpinner = ({ text = "Nahrávám..." }) => {
    return ReactDOM.createPortal(
        <div style={overlayStyle}>
            <div style={spinnerContainerStyle}>
                <div style={spinnerStyle}></div>
                <span style={textStyle}>{text}</span>
            </div>
            <style>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>,
        document.body
    )
};

// Styles for the overlay and spinner
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: "50%",       // Centers it horizontally
    transform: "translateX(-50%)", // Adjusts for its own width
    width: "30vw",
    height: "20vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    zIndex: 9999, // Ensure it's above all other components
};

const spinnerContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

const spinnerStyle = {
    width: "60px", // Larger size
    height: "60px",
    border: "6px solid rgba(0, 0, 0, 0.2)",
    borderTopColor: "#007bff", // Spinner color
    borderRadius: "50%",
    animation: "spin 1s infinite linear",
    marginBottom: "15px",
};

const textStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#555",
};
