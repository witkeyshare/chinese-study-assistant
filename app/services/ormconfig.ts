import 'reflect-metadata';
import { DataSourceOptions,DataSource } from "typeorm";
import { Character } from './entities/Character';
import { ViewHistory } from './entities/ViewHistory';
import { config as dotenv } from 'dotenv';

dotenv();

const isProduction = process.env.NODE_ENV === 'production';

const ormconfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema:process.env.SCHEMA||'public',
  ssl: isProduction ? {
    rejectUnauthorized: false
  } : false,
  extra: isProduction ? {
    ssl: {
      rejectUnauthorized: false
    }
  } : {},
  synchronize: false,
  logging: true,
  entities: [ Character,ViewHistory],

  subscribers: [],
}; 


// 配置数据库连接
export const AppDataSource = new DataSource(ormconfig);


// 初始化数据库连接
const initializeDatabase = async (retries = 3, delay = 5000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('Database connection initialized successfully');
        return;
      }
    } catch (err) {
      lastError = err;
      console.error(`Database connection attempt ${i + 1}/${retries} failed:`, err);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to initialize database after multiple attempts:', lastError);
  process.exit(1);
};

initializeDatabase();

