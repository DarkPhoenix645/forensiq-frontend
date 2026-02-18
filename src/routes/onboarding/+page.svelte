<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { 
		Shield, 
		Building2, 
		CheckCircle2, 
		ArrowRight, 
		ArrowLeft, 
		Loader2 
	} from '@lucide/svelte';

	let step = $state(1);
	let loading = $state(false);

	// Form values
	let orgName = $state('');
	let orgType = $state('');
	let orgSize = $state('');

	const orgTypes = [
		{ value: 'bfsi', label: 'Banking & Finance (BFSI)' },
		{ value: 'defense', label: 'Defense / Government' },
		{ value: 'healthcare', label: 'Healthcare' },
		{ value: 'telecom', label: 'Telecom' },
		{ value: 'enterprise', label: 'Enterprise IT' }
	];

	const orgSizes = [
		{ value: 'small', label: '1–50 users' },
		{ value: 'medium', label: '51–500 users' },
		{ value: 'large', label: '501–5000 users' },
		{ value: 'enterprise', label: '5000+ users' }
	];
</script>

<svelte:head>
	<title>Org Setup | ForensIQ</title>
</svelte:head>

<div class="min-h-screen bg-background grid-bg flex flex-col items-center justify-center p-6">
	<div class="w-full max-w-2xl">
		<!-- Progress Stepper -->
		<div class="flex items-center justify-center gap-4 mb-12">
			{#each [1, 2, 3] as i}
				<div class="flex items-center gap-2">
					<div 
						class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
						{step >= i ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'bg-muted text-muted-foreground border border-border'}"
					>
						{i}
					</div>
					{#if i < 3}
						<div class="w-12 h-px bg-border relative">
							{#if step > i}
								<div class="absolute inset-0 bg-primary/50 transition-all duration-500"></div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<Card.Root class="border-border bg-card/50 backdrop-blur-md shadow-2xl">
			<form 
				method="POST" 
				use:enhance={() => {
					loading = true;
					return async ({ result }) => {
						if (result.type === 'success') {
							goto('/dashboard');
						} else {
							console.error(result);
							// You could add a toast error here
						}
						loading = false;
					};
				}}
			>
				<!-- 
					CRITICAL FIX: 
					Hidden inputs must be outside the {#if} blocks so they exist in the DOM 
					when the form submits, regardless of which step is currently visible.
				-->
				<input type="hidden" name="name" value={orgName} />
				<input type="hidden" name="type" value={orgType} />
				<input type="hidden" name="size" value={orgSize} />

				<Card.Header>
					{#if step === 1}
						<Card.Title class="text-2xl flex items-center gap-2">
							<Building2 class="w-6 h-6 text-primary" /> Organization Profile
						</Card.Title>
						<Card.Description>Identify your legal entity to begin evidence sealing.</Card.Description>
					{:else if step === 2}
						<Card.Title class="text-2xl flex items-center gap-2">
							<Shield class="w-6 h-6 text-primary" /> Security Policy
						</Card.Title>
						<Card.Description>Configure your cryptographic standards for court admissibility.</Card.Description>
					{:else}
						<Card.Title class="text-2xl flex items-center gap-2">
							<CheckCircle2 class="w-6 h-6 text-emerald-400" /> Confirm Deployment
						</Card.Title>
						<Card.Description>Review your ForensIQ node configuration.</Card.Description>
					{/if}
				</Card.Header>

				<Card.Content class="space-y-6 min-h-[300px]">
					{#if step === 1}
						<div class="space-y-6 fade-in-up">
							<div class="space-y-2">
								<Label for="nameInput">Organization Name</Label>
								<Input 
									id="nameInput" 
									bind:value={orgName} 
									placeholder="e.g. Ministry of External Affairs" 
									required 
									class="bg-background/50"
								/>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div class="space-y-2">
									<Label>Industry Sector</Label>
									<Select.Root type="single" bind:value={orgType}>
										<Select.Trigger class="w-full bg-background/50">
											{orgType ? orgTypes.find(t => t.value === orgType)?.label : "Select sector"}
										</Select.Trigger>
										<Select.Content>
											{#each orgTypes as t}
												<Select.Item value={t.value}>{t.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</div>
								<div class="space-y-2">
									<Label>Entity Size</Label>
									<Select.Root type="single" bind:value={orgSize}>
										<Select.Trigger class="w-full bg-background/50">
											{orgSize ? orgSizes.find(s => s.value === orgSize)?.label : "Select size"}
										</Select.Trigger>
										<Select.Content>
											{#each orgSizes as s}
												<Select.Item value={s.value}>{s.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</div>
							</div>
						</div>

					{:else if step === 2}
						<div class="space-y-6 fade-in-up">
							<div class="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
								<h4 class="text-sm font-bold text-primary uppercase flex items-center gap-2">
									<Shield class="w-4 h-4" /> Standard: ISO 27037
								</h4>
								<p class="text-xs text-muted-foreground leading-relaxed">
									ForensIQ defaults to RSA-4096 signing with RFC-3161 compliant timestamps for all cold-path evidence to ensure legal admissibility.
								</p>
							</div>
							
							<div class="space-y-2">
								<Label>Primary Storage Region</Label>
								<!-- Styled to look exactly like a disabled Input -->
								<div class="flex h-10 w-full items-center rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed opacity-80 gap-2">
									<span>🇮🇳</span>
									<span class="font-mono">India - Central (AWS ap-south-1)</span>
								</div>
								<p class="text-[10px] text-muted-foreground">Data sovereignty enforced. Logs remain within national borders.</p>
							</div>
						</div>

					{:else}
						<div class="space-y-6 fade-in-up">
							<div class="grid grid-cols-2 gap-4 text-sm">
								<div class="p-4 border border-border/50 rounded-lg bg-muted/20 space-y-1">
									<div class="text-[10px] text-muted-foreground uppercase tracking-widest">Entity</div>
									<div class="font-bold text-lg">{orgName}</div>
								</div>
								<div class="p-4 border border-border/50 rounded-lg bg-muted/20 space-y-1">
									<div class="text-[10px] text-muted-foreground uppercase tracking-widest">Sector</div>
									<div class="font-bold text-lg">{orgType ? orgTypes.find(t => t.value === orgType)?.label : 'Unknown'}</div>
								</div>
							</div>
							
							<div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex gap-3 items-start">
								<CheckCircle2 class="w-5 h-5 shrink-0 mt-0.5" />
								<div>
									<p class="font-bold mb-1">System Ready</p>
									<p class="text-xs text-emerald-500/80 leading-relaxed">
										Ready to deploy local ForensIQ instance. All logs will be cryptographically isolated upon creation.
									</p>
								</div>
							</div>
						</div>
					{/if}
				</Card.Content>

				<Card.Footer class="flex justify-between border-t border-border pt-6">
					{#if step > 1}
						<Button variant="ghost" onclick={() => step--} type="button">
							<ArrowLeft class="w-4 h-4 mr-2" /> Back
						</Button>
					{:else}
						<div></div>
					{/if}

					{#if step < 3}
						<Button 
							onclick={() => step++} 
							disabled={!orgName || !orgType || !orgSize}
							type="button"
							class="glow-primary"
						>
							Next <ArrowRight class="w-4 h-4 ml-2" />
						</Button>
					{:else}
						<Button type="submit" class="glow-primary w-full sm:w-auto" disabled={loading}>
							{#if loading}
								<Loader2 class="w-4 h-4 mr-2 animate-spin" />
								Deploying Node...
							{:else}
								Finalize & Launch Node
							{/if}
						</Button>
					{/if}
				</Card.Footer>
			</form>
		</Card.Root>
	</div>
</div>