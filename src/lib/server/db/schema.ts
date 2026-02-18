import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable, primaryKey } from 'drizzle-orm/sqlite-core';

// ── Users (owned by better-auth, but we extend it) ──────────────────────────
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	// Our extensions
	orgId: text('org_id').references(() => organization.id),
	role: text('role', { enum: ['admin', 'analyst', 'investigator'] })
		.notNull()
		.default('analyst')
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', {
		mode: 'timestamp'
	}),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', {
		mode: 'timestamp'
	}),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

// ── ForensIQ Domain Tables ───────────────────────────────────────────────────
export const organization = sqliteTable('organization', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	type: text('type', {
		enum: ['bfsi', 'defense', 'healthcare', 'telecom', 'enterprise', 'other']
	}).notNull(),
	size: text('size', {
		enum: ['small', 'medium', 'large', 'enterprise']
	}).notNull(),
	region: text('region').notNull().default('India - Central'),
	retentionDays: integer('retention_days').notNull().default(365),
	signingMode: text('signing_mode').notNull().default('rsa4096'),
	timestampAuthority: text('timestamp_authority').notNull().default('rfc3161'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export const logSource = sqliteTable('log_source', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	type: text('type').notNull(),
	trustLevel: text('trust_level', { enum: ['High', 'Medium', 'Low'] })
		.notNull()
		.default('Medium'),
	trustTier: text('trust_tier', { enum: ['T1', 'T2', 'T3'] })
		.notNull()
		.default('T2'),
	ip: text('ip'),
	os: text('os'),
	status: text('status', { enum: ['active', 'warning', 'offline'] })
		.notNull()
		.default('active'),
	tags: text('tags').notNull().default('[]'), // JSON array
	logsPerMin: integer('logs_per_min').notNull().default(0),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export const audit = sqliteTable('audit', {
	id: text('id').primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	status: text('status', {
		enum: ['pending', 'running', 'completed', 'failed']
	})
		.notNull()
		.default('pending'),
	severity: text('severity', {
		enum: ['critical', 'high', 'medium', 'low', 'info']
	}),
	sourcesJson: text('sources_json').notNull().default('[]'), // JSON array of source IDs
	findingsCount: integer('findings_count').notNull().default(0),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	completedAt: integer('completed_at', { mode: 'timestamp' })
});
