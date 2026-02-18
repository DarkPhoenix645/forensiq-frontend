<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn, signUp } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';
	import logoPng from '$lib/assets/logo.png';
	import { Loader2, ShieldCheck, Lock, AlertCircle } from '@lucide/svelte';

	let isSignUp = $state(false);
	let loading = $state(false);
	let error = $state('');

	let email = $state('');
	let password = $state('');
	let name = $state('');

	async function handleAuth() {
		loading = true;
		error = '';

		try {
			if (isSignUp) {
				const { data, error: resError } = await signUp.email({
					email,
					password,
					name,
					callbackURL: '/onboarding'
				});
				if (resError) throw new Error(resError.message);
				goto('/onboarding');
			} else {
				const { data, error: resError } = await signIn.email({
					email,
					password,
					callbackURL: '/dashboard'
				});
				if (resError) throw new Error(resError.message);
				goto('/dashboard');
			}
		} catch (e: any) {
			error = e.message || 'Authentication failed';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{isSignUp ? 'Create Account' : 'Sign In'} | ForensIQ</title>
</svelte:head>

<div class="bg-background grid min-h-screen lg:grid-cols-2">
	<!-- Left Side: Branding/Visuals -->
	<div
		class="bg-card border-border grid-bg relative hidden flex-col justify-between overflow-hidden border-r p-12 lg:flex"
	>
		<div class="scan-line bg-primary/20 pointer-events-none absolute inset-x-0 h-px"></div>

		<a href="/" class="z-10 flex items-center gap-3">
			<img src={logoPng} alt="Logo" class="h-10 w-10 object-contain" />
			<span class="text-2xl font-bold tracking-tight">
				Forens<span class="text-primary glow-text">IQ</span>
			</span>
		</a>

		<div class="z-10 space-y-6">
			<h2 class="text-4xl leading-tight font-black">
				Trusted Evidence.<br />
				<span class="text-primary">Verified Attribution.</span>
			</h2>
			<div class="space-y-4">
				<div class="text-muted-foreground flex items-center gap-3">
					<ShieldCheck class="h-5 w-5 text-emerald-400" />
					<span>ISO 27037 compliant evidence handling.</span>
				</div>
				<div class="text-muted-foreground flex items-center gap-3">
					<Lock class="text-primary h-5 w-5" />
					<span>RSA-4096 cryptographically sealed logs.</span>
				</div>
			</div>
		</div>

		<p class="text-muted-foreground z-10 font-mono text-sm">
			DSCI Cyber Innovation Challenge v1.0 // Team editedit
		</p>
	</div>

	<!-- Right Side: Auth Form -->
	<div class="flex items-center justify-center p-6">
		<Card.Root class="border-border bg-card/50 w-full max-w-md backdrop-blur-sm">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl font-bold">{isSignUp ? 'Create account' : 'Sign in'}</Card.Title
				>
				<Card.Description>
					{isSignUp
						? 'Enter your details to set up your forensic workspace'
						: 'Enter your credentials to access your dashboard'}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleAuth();
					}}
					class="space-y-4"
				>
					{#if isSignUp}
						<div class="space-y-2">
							<Label for="name">Full Name</Label>
							<Input id="name" bind:value={name} placeholder="Analyst Name" required />
						</div>
					{/if}

					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							bind:value={email}
							placeholder="name@org.gov.in"
							required
						/>
					</div>

					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input id="password" type="password" bind:value={password} required />
					</div>

					{#if error}
						<div
							class="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-md border p-3 text-sm"
						>
							<AlertCircle class="h-4 w-4" />
							{error}
						</div>
					{/if}

					<Button type="submit" class="glow-primary w-full" disabled={loading}>
						{#if loading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Processing...
						{:else}
							{isSignUp ? 'Set Up Workspace' : 'Access Platform'}
						{/if}
					</Button>
				</form>
			</Card.Content>
			<Card.Footer class="flex flex-col gap-4">
				<Separator />
				<p class="text-muted-foreground w-full text-center text-sm">
					{isSignUp ? 'Already have an account?' : "Don't have an account?"}
					<button
						onclick={() => (isSignUp = !isSignUp)}
						class="text-primary font-medium hover:underline"
					>
						{isSignUp ? 'Sign in' : 'Create one'}
					</button>
				</p>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
