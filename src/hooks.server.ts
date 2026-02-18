import { auth } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;

	const path = event.url.pathname;

	// 1. Define Route categories
	const isAuthPage = path.startsWith('/auth');
	const isOnboardingPage = path.startsWith('/onboarding');
	const isApiPage = path.startsWith('/api');
	const isPublicPage = path === '/';

	// 2. Authentication Guard
	if (!event.locals.user && !isAuthPage && !isPublicPage && !isApiPage) {
		throw redirect(302, '/auth');
	}

	// 3. Onboarding & Org Guard
	if (event.locals.user) {
		const hasOrg = !!event.locals.user.orgId;

		if (!hasOrg && !isOnboardingPage && !isAuthPage && !isPublicPage) {
			throw redirect(302, '/onboarding');
		}

		if (hasOrg && isOnboardingPage) {
			throw redirect(302, '/dashboard');
		}

		if (isAuthPage) {
			throw redirect(302, hasOrg ? '/dashboard' : '/onboarding');
		}
	}

	return resolve(event);
};
