import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

const prisma = new PrismaClient()

export const authOptions = {
	providers: [
		CredentialsProvider({
			credentials: {
				email: {
					label: 'Email Address',
					type: 'email',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
			
			authorize: authorize(prisma),
		}),
	]
}

function authorize(prisma) {
	return async (credentials | undefined) => {
		if (!credentials) throw new Error("Missing credentials")
		if (!credentials.email) throw new Error('"email" is required in credentials')
		if (!credentials.password) throw new Error('"password" is required in credentials')
		
		const maybeUser = await prisma.user.findFirst({
			where: { email: credentials.email },
			select: { id: true, email: true, password: true },
		});
		
		if (!maybeUser || !maybeUser.password) return null
		
		const isValid = await compare(credentials.password, maybeUser.password)
		if (!isValid) {
			return null
		}
		
		return { id: maybeUser.id, email: maybeUser.email }
	}
}

export default NextAuth(authOptions)