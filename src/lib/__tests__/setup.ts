// Tell React we're in an act() environment so the test renderer's frame-loop
// updates don't spam "not configured to support act(...)" warnings.
;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true
