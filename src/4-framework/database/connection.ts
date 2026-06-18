import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'prontomed',
  username: process.env.DB_USER || 'prontomed',
  password: process.env.DB_PASSWORD || 'prontomed123',
  logging: false,
});
