import { useEffect, useState } from "react";

/**
 * const debouncedSearch = useDebouncedValue(search, 300);
 * Use the debounced value in your filter/API call so you're not
 * re-filtering on every keystroke.
 */
export default function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
