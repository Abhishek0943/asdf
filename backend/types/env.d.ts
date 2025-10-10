declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    DB_URI_LOCAL: string;
    DB_URI_PRO: string;
  }
}