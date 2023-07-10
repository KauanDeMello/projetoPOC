import pgPromise from 'pg-promise';

const pgp = pgPromise();

export const db = pgp('postgres://username:password@localhost:5432/projetoPC');