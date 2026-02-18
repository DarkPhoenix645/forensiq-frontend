// src/lib/server/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification
		}
	}),
	user: {
		additionalFields: {
			orgId: {
				type: 'string',
				required: false
			},
			role: {
				type: 'string',
				required: false
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	}
});
