import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const TAG_LENGTH = 16

function getDerivedKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET
  const salt = process.env.ENCRYPTION_SALT

  if (!secret || !salt) {
    throw new Error('ENCRYPTION_SECRET and ENCRYPTION_SALT must be set in environment')
  }

  return crypto.pbkdf2Sync(secret, salt, 100_000, KEY_LENGTH, 'sha256')
}

export function encrypt(plaintext: string): string {
  const key = getDerivedKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decrypt(encoded: string): string {
  const key = getDerivedKey()
  const data = Buffer.from(encoded, 'base64')

  const iv = data.subarray(0, IV_LENGTH)
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
  const ciphertext = data.subarray(IV_LENGTH + TAG_LENGTH)

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  return decipher.update(ciphertext) + decipher.final('utf8')
}
