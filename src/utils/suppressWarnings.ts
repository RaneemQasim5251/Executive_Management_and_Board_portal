// Suppress common development warnings that don't affect functionality

// Suppress React Router future flag warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    
    // Suppress React Router future flag warnings
    if (typeof message === 'string' && (
      message.includes('React Router Future Flag Warning') ||
      message.includes('v7_startTransition') ||
      message.includes('v7_relativeSplatPath')
    )) {
      return;
    }
    
    // Suppress findDOMNode warnings (from third-party libraries)
    if (typeof message === 'string' && message.includes('findDOMNode is deprecated')) {
      return;
    }
    
    // Suppress Ant Design deprecation warnings we've already addressed
    if (typeof message === 'string' && (
      message.includes('`children` is deprecated') ||
      message.includes('Please use `items` instead')
    )) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
}