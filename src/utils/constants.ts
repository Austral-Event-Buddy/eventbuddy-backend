import * as process from 'process';

export class Constants {
  static PORT: number = 8080;
  static JWT_SECRET: string = process.env.JWT_SECRET || 'secretKey';
}
