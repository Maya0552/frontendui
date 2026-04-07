import { useState } from 'react'
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { CreateDelayer, ErrorHandler } from "@hrbolek/uoisfrontend-shared"
import { ItemUpdateAsyncAction } from '../Queries/ItemUpdateAsyncAction'

// const StudentWithRead = createLazyComponent(UserMediumCard, "user", StudentReadAsyncAction)
// const StudentWithRead = createLazyComponent(ItemUpdateQuery, "user", StudentReadAsyncAction)


const textareaStyles = {
  base: {
      border: "none", // Remove border
      outline: "none", // Remove outline
      resize: "none", // Hide the resize handle
      backgroundColor: "#f8f9fa", // Light background for readability
      transition: "border 0.3s ease, box-shadow 0.3s ease", // Smooth transition
      width: "100%", // Ensure full width by default
      padding: "0.5rem", // Add padding for better usability
      fontSize: "1rem", // Default font size
      borderRadius: "4px", // Rounded corners
  },
  focus: {
      border: "2px solid #0d6efd", // Bootstrap's primary color
      boxShadow: "0 0 5px rgba(13, 110, 253, 0.5)", // Subtle shadow for focus
      resize: "vertical", // Allow resizing vertically only
      backgroundColor: "#fff", // White background on focus
  },
};

export const LargeText = ({ item, value }) => {
  const [_value, setValue] = useState(value);
  const { fetch, loading, error } = useAsyncAction(ItemUpdateAsyncAction, item, { deferred: true });
  const [delayUpdate] = useState(() => CreateDelayer());
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  const onChange = (e) => {
      const value = e.target.value;
      delayUpdate(() => fetch({ ...item, value }));
      setValue(prev => value);
  };

  return (
      <>
          {loading && <span>Ukládám</span>}
          {error && <span>Chyba {JSON.stringify(error)}</span>}
          {error && <ErrorHandler errors={error} />}
          {/* {JSON.stringify(item)} */}
          {/* "{error}" */}
          <textarea
              style={{
                  ...textareaStyles.base,
                  ...(isFocused ? textareaStyles.focus : {}),
              }}
              value={_value || ""}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
          />
      </>
  );
};