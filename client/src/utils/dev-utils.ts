// 開発環境でのみconsole.logを出力するユーティリティ
export const devLog = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export const devError = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

export const devWarn = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args);
  }
};
