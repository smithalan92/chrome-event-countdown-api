import { RowDataPacket } from "mysql2";

export interface DBUserByEmailResult extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

export interface DBUserIDForTokenResult extends RowDataPacket {
  id: number;
}
