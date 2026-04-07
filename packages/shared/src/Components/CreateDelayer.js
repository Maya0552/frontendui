/**
 * shared module.
 * @module shared/components
 */


/**
 * Creates a delayer that ensures delayed execution of a function.
 * If the delayer is triggered again before the delay period expires, the previous delay is canceled.
 *
 * @param {number} delay - The delay in milliseconds (default: 300).
 * @returns {Function} A function that delays the execution of a given function.
 */
export const CreateDelayer = (delay = 300) => {
    let timerId = null; // Tracks the active timer
    let isPending = false; // Tracks if a delay is currently pending

    /**
     * Delays the execution of the given function by the specified delay.
     *
     * @param {Function} delayedFunc - The function to be executed after the delay.
     * @returns {Promise} A promise that resolves when the delayed function completes.
     */
    return (delayedFunc) => {
        if (typeof delayedFunc !== 'function') {
            throw new Error("Delayed function must be a valid function.");
        }

        // Cancel any existing timer
        if (isPending) {
            clearTimeout(timerId);
            timerId = null;
            isPending = false;
        }

        // Return a promise that resolves when the delayed function is executed
        return new Promise((resolve, reject) => {
            const encapsulatedFunc = () => {
                timerId = null;
                isPending = false;

                try {
                    // Execute the delayed function and resolve the promise
                    const result = delayedFunc();
                    resolve(result);
                } catch (error) {
                    // Reject the promise if the delayed function throws
                    reject(error);
                }
            };

            // Set a new timer
            isPending = true;
            timerId = setTimeout(encapsulatedFunc, delay);
        });
    };
};