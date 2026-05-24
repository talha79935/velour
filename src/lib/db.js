import { neon } from '@neondatabase/serverless';

// Lazy initialization to avoid build-time errors when DATABASE_URL is not set
let _sql = null;

export function getDb() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

// For convenience, export a sql tagged template that uses getDb()
export const sql = new Proxy(() => {}, {
  apply: (target, thisArg, args) => getDb()(args[0], ...args.slice(1)),
  get: (target, prop) => {
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      return undefined;
    }
    return getDb()[prop];
  }
});
