import { prisma } from '../plugins/prisma'

export type AuditAction =
  | 'LOGIN'
  | 'REGISTER'
  | 'LOGOUT'
  | 'DEPLOY'
  | 'DELETE_BOT'
  | 'STOP_BOT'
  | 'RESTART_BOT'
  | '2FA_ENABLED'
  | '2FA_DISABLED'
  | '2FA_AUTH_SUCCESS'
  | '2FA_AUTH_FAIL'
  | '2FA_RECOVERY_USED'
  | 'DELETE_ACCOUNT'
  | 'PASSWORD_CHANGED'

interface AuditOptions {
  userId?: string
  userEmail?: string
  action: AuditAction
  ipAddress?: string
  metadata?: Record<string, any>
}

export async function audit(options: AuditOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId,
        userEmail: options.userEmail,
        action: options.action,
        ipAddress: options.ipAddress,
        metadata: options.metadata ?? {},
      },
    })
  } catch (err) {
    console.error('[AuditLog] Failed to write audit log:', err)
  }
}

export function getIp(request: any): string {
  return (
    request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    request.ip ||
    'unknown'
  )
}
