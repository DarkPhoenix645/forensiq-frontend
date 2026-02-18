<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		Activity,
		ShieldCheck,
		Database,
		HardDrive,
		Plus,
		Search,
		MoreVertical,
		ExternalLink,
		AlertCircle,
		CheckCircle2,
		Loader2,
		Clock
	} from '@lucide/svelte';
	import logoPng from '$lib/assets/logo.png';
	import { mockLogSources, orgStats } from '$lib/data/mock';
	import { goto } from '$app/navigation';

	let { data } = $props();

	function triggerIntegrityCheck(sourceName: string) {
		const promise = new Promise((resolve) => setTimeout(resolve, 2000));

		toast.promise(promise, {
			loading: `Verifying Merkle Chain for ${sourceName}...`,
			success: (data) => {
				return `Integrity Verified: SHA-256 Hash Matched`;
			},
			error: 'Verification failed',
			description: 'Checking block signatures against RFC-3161 timestamp authority.'
		});
	}
</script>

<svelte:head>
	<title>Dashboard | ForensIQ</title>
</svelte:head>

<div class="bg-background min-h-screen">
	<!-- Top Navigation -->
	<header
		class="border-border bg-card/30 sticky top-0 z-40 flex h-16 items-center justify-between border-b px-8 backdrop-blur-md"
	>
		<div class="flex items-center gap-4">
			<div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
				<img src={logoPng} alt="ForensIQ" class="aspect-square h-full w-full object-contain" />
			</div>
			<div class="bg-border h-4 w-px"></div>
			<div class="flex flex-col">
				<span class="text-muted-foreground font-mono text-xs tracking-widest uppercase"
					>Workspace</span
				>
				<span class="text-sm font-bold">{data.user?.name}'s Command Node</span>
			</div>
		</div>

		<div class="flex items-center gap-4">
			<div
				class="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1"
			>
				<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
				<span class="text-[10px] font-bold tracking-tighter text-emerald-500 uppercase"
					>Node Secure</span
				>
			</div>
			<Button variant="outline" size="sm" class="gap-2">
				<Search class="h-4 w-4" /> Global Search
			</Button>
		</div>
	</header>

	<main class="mx-auto max-w-7xl space-y-8 p-8">
		<!-- Summary Grid -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card.Root class="bg-card/50">
				<Card.Header class="flex flex-row items-center justify-between pb-2">
					<Card.Title class="text-muted-foreground text-xs font-medium uppercase"
						>Integrity Score</Card.Title
					>
					<ShieldCheck class="h-4 w-4 text-emerald-400" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{orgStats.integrityScore}%</div>
					<p class="text-muted-foreground mt-1 text-[10px]">✓ All Merkle chains valid</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="bg-card/50">
				<Card.Header class="flex flex-row items-center justify-between pb-2">
					<Card.Title class="text-muted-foreground text-xs font-medium uppercase"
						>Logs Processed (24h)</Card.Title
					>
					<Activity class="text-primary h-4 w-4" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{(orgStats.totalLogs24h / 1000000).toFixed(1)}M</div>
					<p class="text-muted-foreground mt-1 text-[10px]">
						Avg {Math.round(orgStats.totalLogs24h / 1440)} eps
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="bg-card/50">
				<Card.Header class="flex flex-row items-center justify-between pb-2">
					<Card.Title class="text-muted-foreground text-xs font-medium uppercase"
						>Evidence Sealed</Card.Title
					>
					<Database class="h-4 w-4 text-blue-400" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{orgStats.blocksSealed}</div>
					<p class="text-muted-foreground mt-1 text-[10px]">Last sealed {orgStats.lastSealedAt}</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="bg-card/50 border-primary/20">
				<Card.Header class="flex flex-row items-center justify-between pb-2">
					<Card.Title class="text-primary text-xs font-medium uppercase">Active Audits</Card.Title>
					<Clock class="text-primary h-4 w-4" />
				</Card.Header>
				<Card.Content>
					<div class="text-primary text-2xl font-bold">{orgStats.investigationsActive}</div>
					<p class="text-primary/70 mt-1 text-[10px]">Requires Analyst review</p>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Log Sources & Audit Trigger -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="space-y-4 lg:col-span-2">
				<div class="flex items-center justify-between">
					<h3 class="flex items-center gap-2 text-lg font-bold">
						<HardDrive class="text-muted-foreground h-5 w-5" /> Managed Log Sources
					</h3>
					<Badge variant="outline">{orgStats.sourcesOnline}/{orgStats.sourcesTotal} Online</Badge>
				</div>

				<div class="grid gap-3">
					{#each mockLogSources as source}
						<div
							class="border-border bg-card/40 hover:bg-card/60 group flex items-center justify-between rounded-lg border p-4 transition-colors"
						>
							<div class="flex items-center gap-4">
								<div class="bg-muted border-border rounded border p-2">
									<Activity
										class="h-4 w-4 {source.status === 'active'
											? 'text-emerald-400'
											: 'text-amber-400'}"
									/>
								</div>
								<div>
									<div class="flex items-center gap-2 text-sm font-bold">
										{source.name}
										<Badge variant="secondary" class="h-4 text-[9px] uppercase"
											>{source.trustTier}</Badge
										>
									</div>
									<div class="text-muted-foreground font-mono text-[10px]">
										{source.ip} • {source.type}
									</div>
								</div>
							</div>
							<div class="flex items-center gap-6">
								<div class="hidden text-right sm:block">
									<div class="text-[10px] font-bold">{source.logsPerMin} eps</div>
									<div class="text-muted-foreground text-[9px] uppercase">{source.lastSeen}</div>
								</div>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<Button variant="ghost" size="icon" class="h-8 w-8"
											><MoreVertical class="h-4 w-4" /></Button
										>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end" class="bg-card border-border border shadow-xl">
										<DropdownMenu.Item onclick={() => goto('/audit/aud_001')}
											>View Raw Stream</DropdownMenu.Item
										>
										<DropdownMenu.Item onclick={() => triggerIntegrityCheck(source.name)}
											>Verify Block Integrity</DropdownMenu.Item
										>
										<DropdownMenu.Separator />
										<DropdownMenu.Item class="text-destructive">Remove Source</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right Column: Audit Control -->
			<div class="space-y-6">
				<Card.Root class="border-primary/30 bg-primary/5">
					<Card.Header>
						<Card.Title class="text-base">Start Investigation</Card.Title>
						<Card.Description class="text-primary/70 text-xs">
							Launch a Neuro-Symbolic hypothesis scan across selected log sources.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<!-- Update onclick here -->
						<Button class="glow-primary h-12 w-full gap-2" onclick={() => goto('/audit/aud_001')}>
							<Plus class="h-5 w-5" /> New Investigation
						</Button>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-sm font-bold">Recent Findings</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div
							class="border-border bg-muted/20 group hover:border-primary/50 cursor-pointer space-y-2 rounded border p-3 transition-colors"
							onclick={() => goto('/audit/aud_001')}
							role="button"
							tabindex="0"
							onkeydown={(e) => e.key === 'Enter' && goto('/audit/aud_001')}
						>
							<div class="flex items-start justify-between">
								<Badge class="border-red-500/20 bg-red-500/10 text-[9px] text-red-500"
									>CRITICAL</Badge
								>
								<span class="text-muted-foreground text-[9px]">2h ago</span>
							</div>
							<div class="text-xs font-bold">Credential Dumping - LSASS</div>
							<div class="text-muted-foreground line-clamp-1 text-[10px]">
								Mimikatz pattern detected in DC-01 kernel...
							</div>
						</div>
					</Card.Content>
					<Card.Footer>
						<Button
							variant="ghost"
							size="sm"
							class="w-full gap-2 text-xs"
							onclick={() => goto('/audit/aud_001')}
						>
							View Audit History <ExternalLink class="h-3 w-3" />
						</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>
	</main>
</div>
