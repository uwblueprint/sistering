import * as path from "path";
import { Sequelize } from "sequelize-typescript";

/* eslint-disable-next-line import/prefer-default-export */
export const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_DEV}`,
  { models: [path.join(__dirname, "/*.model.ts")] },
);

export default sequelize;
