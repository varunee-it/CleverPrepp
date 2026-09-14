export const devLog = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

export const devWarn = (...args) => {
  if (import.meta.env.DEV) {
    console.warn(...args);
  }
};

export const devInfo = (...args) => {
  if (import.meta.env.DEV) {
    console.info(...args);
  }
};

export const devDebug = (...args) => {
  if (import.meta.env.DEV) {
    console.debug(...args);
  }
};
