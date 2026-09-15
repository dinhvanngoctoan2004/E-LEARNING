export interface IUser {
  id: string;
  email: string;
  password: string;
  phone_number: string;
  name: string;
  year_of_birth: number;
  role: 'student' | 'teacher' | 'admin';
  job: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateUserDTO {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export const CREATE_USERS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	email VARCHAR(225) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	phone_number VARCHAR(15),
  name VARCHAR(100) NOT NULL,
	year_of_birth SMALLINT,
	role VARCHAR(50) DEFAULT 'student',
	job VARCHAR(100),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
`;
