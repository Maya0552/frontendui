import { useState, useCallback } from 'react';

/**
 * shared module.
 * @module shared/components
 */

/**
 * A `DeleteButton` component that toggles between a warning button and a confirmation red button.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The content to display inside the button(s).
 * @param {function} props.onClick - The callback function invoked when the red delete button is clicked.
 *
 * @example
 * <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
 *
 * @returns {JSX.Element} A toggleable button component.
 */
export const DeleteButton = ({ className, className1="btn btn-sm btn-warning", className2="btn btn-sm btn-danger", children, onClick }) => {
  const [isRedButtonVisible, setIsRedButtonVisible] = useState(false);

  const hideWarningButton = useCallback(() => setIsRedButtonVisible(false), []);
  const showWarningButton = useCallback(() => setIsRedButtonVisible(true), []);

  return (
    <>
      {/* Yellow warning button */}
      <button
        className={className || className1}
        onClick={isRedButtonVisible ? hideWarningButton : showWarningButton}
      >
        {children}
      </button>

      {/* Red confirmation delete button */}
      {isRedButtonVisible && (
        <button className={className2} onClick={onClick}>
          {children}
        </button>
      )}
    </>
  );
};
