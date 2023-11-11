import { PrismaClient } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const AccountComponent = () => {
	const { data: session } = useSession()

	if (session) {
		return (
			<>
				Signed in as {session.user.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		)
	}

	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	)
}

const prisma = new PrismaClient()

const Page = ({ users }) => {
	return (
		<div>
			<h1>Hello, Next.js!</h1>
			<AccountComponent />
			<pre>{JSON.stringify(users, null, 4)}</pre>
		</div>
	)
}

export async function getServerSideProps () {
	const users = await prisma.user.findMany()

	return {
		props: {
			users
		}
	}
}

export default Page