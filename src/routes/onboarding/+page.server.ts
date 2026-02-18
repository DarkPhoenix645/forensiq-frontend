import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organization, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = locals.session;
		if (!session) throw redirect(302, '/auth');

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const type = formData.get('type') as any;
		const size = formData.get('size') as any;

		console.log(name, type, size);
		if (!name || !type || !size) {
			return fail(400, { message: 'Missing required fields' });
		}

		try {
			const orgId = nanoid();

			// 1. Create Organization
			await db.insert(organization).values({
				id: orgId,
				name,
				type,
				size,
				region: 'India - Central',
				retentionDays: 365,
				signingMode: 'rsa4096',
				timestampAuthority: 'rfc3161'
			});

			// 2. Link User to Org
			await db.update(user).set({ orgId }).where(eq(user.id, session.userId));

			return { success: true };
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Failed to create organization' });
		}
	}
};
