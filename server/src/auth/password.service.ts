import {
  randomBytes,
  scrypt,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { Injectable } from "@nestjs/common";

const KEY_LENGTH = 64;
const SCRYPT_COST = 32_768;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SCRYPT_OPTIONS = {
  N: SCRYPT_COST,
  r: SCRYPT_BLOCK_SIZE,
  p: SCRYPT_PARALLELIZATION,
  maxmem: 64 * 1024 * 1024,
} as const;
const DUMMY_SALT = Buffer.from("spotmtl-invalid-user", "utf8");

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });
}

function formatPasswordHash(salt: Buffer, derivedKey: Buffer): string {
  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

@Injectable()
export class PasswordService {
  private readonly dummyPasswordHash = formatPasswordHash(
    DUMMY_SALT,
    scryptSync("invalid-password", DUMMY_SALT, KEY_LENGTH, SCRYPT_OPTIONS),
  );

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derivedKey = await deriveKey(password, salt);

    return formatPasswordHash(salt, derivedKey);
  }

  async verify(password: string, storedHash?: string): Promise<boolean> {
    const candidateHash = storedHash ?? this.dummyPasswordHash;
    const parts = candidateHash.split("$");

    if (
      parts.length !== 6 ||
      parts[0] !== "scrypt" ||
      Number(parts[1]) !== SCRYPT_COST ||
      Number(parts[2]) !== SCRYPT_BLOCK_SIZE ||
      Number(parts[3]) !== SCRYPT_PARALLELIZATION
    ) {
      await this.verify(password, this.dummyPasswordHash);
      return false;
    }

    try {
      const salt = Buffer.from(parts[4], "base64url");
      const expectedKey = Buffer.from(parts[5], "base64url");
      const actualKey = await deriveKey(password, salt);

      return (
        expectedKey.length === actualKey.length &&
        timingSafeEqual(expectedKey, actualKey)
      );
    } catch {
      await this.verify(password, this.dummyPasswordHash);
      return false;
    }
  }
}
