// Clean up all remaining development warnings

if (process.env.NODE_ENV === 'development') {
  // Suppress console warnings for known third-party issues
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = String(args[0] || '');
    
    // Suppress known warnings
    const suppressedWarnings = [
      '[antd: Menu] `children` is deprecated',
      'Warning: findDOMNode is deprecated',
      'React Router Future Flag Warning',
      'v7_startTransition',
      'v7_relativeSplatPath',
      'Please use `items` instead'
    ];
    
    if (suppressedWarnings.some(warning => message.includes(warning))) {
      return; // Skip these warnings
    }
    
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = String(args[0] || '');
    
    // Suppress known errors that don't affect functionality
    const suppressedErrors = [
      'Warning: findDOMNode is deprecated'
    ];
    
    if (suppressedErrors.some(error => message.includes(error))) {
      return; // Skip these errors
    }
    
    originalError.apply(console, args);
  };
  
  console.log('🧹 Development warnings cleaned up!');
}