import { TOTP, Secret } from 'otpauth'
import QRCode from 'qrcode'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { encrypt, decrypt } from './encryption'

const RECOVERY_CODE_COUNT = 10
const RECOVERY_CODE_LENGTH = 10
const BCRYPT_ROUNDS = 12

export interface TwoFactorSetup {
  encryptedSecret: string
  qrCodeDataUrl: string
  recoveryCodes: string[]
  hashedRecoveryCodes: string[]
}

export async function generateTwoFactorSetup(
  userEmail: string,
  appName: string,
): Promise<TwoFactorSetup> {
  const totp = new TOTP({
    issuer: appName,
    label: userEmail,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: new Secret(),
  })

  const rawSecret = totp.secret.base32
  const encryptedSecret = encrypt(rawSecret)
  const otpauthUrl = totp.toString()
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, { errorCorrectionLevel: 'H' })

  const recoveryCodes = generateRecoveryCodes()
  const hashedRecoveryCodes = await Promise.all(
    recoveryCodes.map((code) => bcrypt.hash(code, BCRYPT_ROUNDS)),
  )

  return { encryptedSecret, qrCodeDataUrl, recoveryCodes, hashedRecoveryCodes }
}

export async function verifyTOTP(token: string, encryptedSecret: string): Promise<boolean> {
  if (!/^\d{6}$/.test(token)) return false

  const rawSecret = decrypt(encryptedSecret)
  const totp = new TOTP({ secret: Secret.fromBase32(rawSecret), digits: 6, period: 30 })

  const delta = totp.validate({ token, window: 1 })
  return delta !== null
}

export async function verifyRecoveryCode(
  suppliedCode: string,
  hashedCodes: string[],
): Promise<number> {
  const normalized = suppliedCode.replace(/[-\s]/g, '').toUpperCase()

  for (let i = 0; i < hashedCodes.length; i++) {
    const match = await bcrypt.compare(normalized, hashedCodes[i])
    if (match) return i
  }
  return -1
}

function generateRecoveryCodes(): string[] {
  return Array.from({ length: RECOVERY_CODE_COUNT }, () => {
    const raw = crypto.randomBytes(RECOVERY_CODE_LENGTH).toString('hex').toUpperCase()
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 10)}`
  })
}
