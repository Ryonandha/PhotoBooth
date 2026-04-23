import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // 1. Buat koneksi pool menggunakan DATABASE_URL dari .env
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. Bungkus pool tersebut ke dalam Prisma Adapter
  const adapter = new PrismaPg(pool)
  
  // 3. Masukkan adapter ke dalam constructor PrismaClient
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma