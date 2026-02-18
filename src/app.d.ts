import type { auth } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			user: typeof auth.$InferPI.user | null;
			session: typeof auth.$InferPI.session | null;
		}
	}
}

export {};
