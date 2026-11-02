import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function resolveDatabaseUrl(): string {
  // If explicitly specified by environment and is a hosted URL (e.g., postgres, mysql)
  const envUrl = process.env.DATABASE_URL
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl
  }

  // Detect serverless environment (Vercel, AWS Lambda, production)
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.env.NODE_ENV === 'production'

  if (isServerless) {
    const tmpDbPath = '/tmp/dev.db'

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.resolve('./prisma/dev.db'),
        path.resolve(__dirname, '..', '..', 'prisma', 'dev.db'),
      ]

      let copied = false
      for (const src of candidates) {
        try {
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, tmpDbPath)
            console.log(`[Prisma] Successfully initialized SQLite at ${tmpDbPath} from ${src}`)
            copied = true
            break
          }
        } catch (err) {
          console.error(`[Prisma] Failed to copy SQLite db from ${src}:`, err)
        }
      }

      if (!copied) {
        console.warn('[Prisma] Source dev.db not found among candidates; using /tmp/dev.db directly')
      }
    }

    const tmpUrl = `file:${tmpDbPath}`
    process.env.DATABASE_URL = tmpUrl
    return tmpUrl
  }

  // Local development
  if (!process.env.DATABASE_URL) {
    const localDbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const localUrl = `file:${localDbPath}`
    process.env.DATABASE_URL = localUrl
    return localUrl
  }

  return process.env.DATABASE_URL
}

const dbUrl = resolveDatabaseUrl()

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: resolveDatabaseUrl(),
      },
    },
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
