// useScript implementation from: https://usehooks.com/useScript/
import { useEffect, useState } from 'react';

// Hook
const loadedScripts = [];
export const useScript = (src) => {
  // Keeping track of script loaded and error state
  const [state, setState] = useState({
    loaded: false,
    error: false
  });

  useEffect(
    () => {
      // If loadedScripts array already includes src that means another instance ...
      // ... of this hook already loaded this script, so no need to load again.
      if (loadedScripts.includes(src)) {
        setState({
          loaded: true,
          error: false
        });

        return;
      }

      loadedScripts.push(src);

      // Create script
      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      // Script event listener callbacks for load and error
      const onScriptLoad = () => {
        setState({
          loaded: true,
          error: false
        });
      };

      const onScriptError = () => {
        // Remove from loadedScripts we can try loading again
        const index = loadedScripts.indexOf(src);
        if (index >= 0) loadedScripts.splice(index, 1);
        script.remove();

        setState({
          loaded: true,
          error: true
        });
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);

      // Add script to document body
      document.body.appendChild(script);

      // Remove event listeners on cleanup
      return () => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
      };
    }
  );

  return [state.loaded, state.error];
}
