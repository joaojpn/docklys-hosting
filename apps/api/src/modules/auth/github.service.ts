import axios from 'axios'
import { prisma } from '../../plugins/prisma'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function getGithubAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: 'user:email',
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

export async function handleGithubCallback(code: string) {
  const tokenRes = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    },
    { headers: { Accept: 'application/json' } }
  )

  const accessToken = tokenRes.data.access_token
  if (!accessToken) throw new Error('Failed to get GitHub access token')

  const { data: githubUser } = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  const emailRes = await axios.get('https://api.github.com/user/emails', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  const primaryEmail = emailRes.data.find((e: any) => e.primary)?.email
  if (!primaryEmail) throw new Error('No primary email found on GitHub account')

  let user = await prisma.user.findUnique({
    where: { githubId: String(githubUser.id) },
  })

  if (!user) {
    user = await prisma.user.findUnique({ where: { email: primaryEmail } })

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          githubId: String(githubUser.id),
          githubLogin: githubUser.login,
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          name: githubUser.name || githubUser.login,
          email: primaryEmail,
          githubId: String(githubUser.id),
          githubLogin: githubUser.login,
        },
      })
    }
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  return { token, user: { id: user.id, name: user.name, email: user.email } }
}
