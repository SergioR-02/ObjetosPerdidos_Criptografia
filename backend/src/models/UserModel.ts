import { RowDataPacket } from 'mysql2';
import { MySQLDatabase } from '../database/mysql';
import { RegisterInput } from '../schemas/authSchemas';
import { UpdateUserInput } from '../schemas/authSchemas';

interface User {
  user_id: number;
  email: string;
  password_hash: string;
  name: string;
  phone_number?: string;
  is_confirmed: boolean;
  is_active: boolean;
  role: 'user' | 'admin';
  two_factor_secret?: string;
  two_factor_enabled: boolean;
  backup_codes?: string[];
  created_at: Date;
  updated_at: Date;
}

class UserModel {
  // Buscar un usuario por email
  async getUserByEmail(email: string): Promise<User | null> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM Users WHERE email = ?', [email]);
    return (rows[0] as User) || null;
  }

  async getUserById(user_id: number): Promise<User | null> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM Users WHERE user_id = ?', [user_id]);
    return (rows[0] as User) || null;
  }

  // Crear un nuevo usuario en la base de datos
  async createUser(input: RegisterInput): Promise<void> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    await connection.query('INSERT INTO Users (email, password_hash, name, phone_number) VALUES (?, ?, ?, ?)', [
      input.email,
      input.password,
      input.name,
      input.phone_number,
    ]);
  }

  // Actualizar informacion del usuario
  async updateUser(user_id: number, input: UpdateUserInput): Promise<void> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    await connection.query('UPDATE Users SET ? WHERE user_id = ?', [input, user_id]);
  }

  // === MÉTODOS DE 2FA ===

  // Establecer el secreto de 2FA para un usuario
  async set2FASecret(user_id: number, secret: string): Promise<void> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    await connection.query('UPDATE Users SET two_factor_secret = ? WHERE user_id = ?', [secret, user_id]);
  }

  // Habilitar 2FA para un usuario y establecer códigos de respaldo
  async enable2FA(user_id: number, backupCodes: string[]): Promise<void> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    await connection.query('UPDATE Users SET two_factor_enabled = TRUE, backup_codes = ? WHERE user_id = ?', [
      JSON.stringify(backupCodes),
      user_id,
    ]);
  }

  // Deshabilitar 2FA para un usuario
  async disable2FA(user_id: number): Promise<void> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    await connection.query(
      'UPDATE Users SET two_factor_enabled = FALSE, two_factor_secret = NULL, backup_codes = NULL WHERE user_id = ?',
      [user_id],
    );
  }

  // Obtener información de 2FA de un usuario
  async get2FAInfo(
    user_id: number,
  ): Promise<{ two_factor_enabled: boolean; two_factor_secret?: string; backup_codes?: string[] } | null> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT two_factor_enabled, two_factor_secret, backup_codes FROM Users WHERE user_id = ?',
      [user_id],
    );

    const result = rows[0] as any;
    if (!result) return null;

    // Parsear backup_codes de forma segura
    let parsedBackupCodes: string[] | null = null;
    if (result.backup_codes) {
      try {
        // Solo intentar parsear si parece ser JSON válido
        if (typeof result.backup_codes === 'string' && result.backup_codes.startsWith('[')) {
          parsedBackupCodes = JSON.parse(result.backup_codes);
        }
      } catch (error) {
        console.error('Error parsing backup_codes JSON:', error);
        parsedBackupCodes = null;
      }
    }

    return {
      two_factor_enabled: !!result.two_factor_enabled,
      two_factor_secret: result.two_factor_secret || null,
      backup_codes: parsedBackupCodes || undefined,
    };
  }

  // Usar un código de respaldo (eliminarlo de la lista)
  async useBackupCode(user_id: number, codeToRemove: string): Promise<boolean> {
    const db = await MySQLDatabase.getInstance();
    const connection = db.getConnection();

    // Obtener códigos actuales
    const info = await this.get2FAInfo(user_id);
    if (!info?.backup_codes) return false;

    // Verificar si el código existe
    const codeIndex = info.backup_codes.indexOf(codeToRemove);
    if (codeIndex === -1) return false;

    // Remover el código usado
    info.backup_codes.splice(codeIndex, 1);

    // Actualizar en la base de datos
    await connection.query('UPDATE Users SET backup_codes = ? WHERE user_id = ?', [
      JSON.stringify(info.backup_codes),
      user_id,
    ]);

    return true;
  }
}

export default UserModel;
