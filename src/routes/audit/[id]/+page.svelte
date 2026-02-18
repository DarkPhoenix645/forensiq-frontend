<script lang="ts">
	import { mockFindings, mockLogSources } from '$lib/data/mock';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import {
		ShieldCheck,
		AlertTriangle,
		Clock,
		Fingerprint,
		ChevronRight,
		FileText,
		Download,
		Share2,
		Terminal,
		Search,
		Brain,
		CheckCircle2
	} from '@lucide/svelte';

	// Find the findings for the current audit ID
	const auditId = $page.params.id || 'aud_001';
	const findings = mockFindings.filter((f) => f.auditId === auditId);

	let selectedFinding = $state(findings[0]);
</script>

<svelte:head>
	<title>Investigation {auditId} | ForensIQ</title>
</svelte:head>

<div class="bg-background min-h-screen pb-20">
	<!-- Header -->
	<div class="border-border bg-card/30 sticky top-0 z-40 border-b backdrop-blur-md">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
			<div class="flex items-center gap-4">
				<Button variant="ghost" size="icon" href="/dashboard"
					><ChevronRight class="rotate-180" /></Button
				>
				<div class="flex flex-col">
					<span class="text-muted-foreground font-mono text-[10px] tracking-widest uppercase"
						>Case ID: {auditId}</span
					>
					<span class="text-sm font-bold">Lateral Movement & Data Exfiltration Analysis</span>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<Button variant="outline" size="sm" class="gap-2"
					><Share2 class="h-4 w-4" /> Share Findings</Button
				>
				<Button size="sm" class="glow-primary gap-2"
					><Download class="h-4 w-4" /> Export Court Dossier (PDF)</Button
				>
			</div>
		</div>
	</div>

	<main class="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-8 lg:grid-cols-12">
		<!-- Left: AI Hypothesis List (Col 1-5) -->
		<div class="space-y-6 lg:col-span-5">
			<div class="flex items-center justify-between">
				<h3
					class="text-muted-foreground flex items-center gap-2 text-sm font-bold tracking-wider uppercase"
				>
					<Brain class="h-4 w-4" /> AI Generated Hypotheses
				</h3>
				<Badge variant="secondary">{findings.length} findings</Badge>
			</div>

			<div class="space-y-3">
				{#each findings as finding}
					<button
						onclick={() => (selectedFinding = finding)}
						class="w-full rounded-xl border p-4 text-left transition-all duration-200
						{selectedFinding.id === finding.id
							? 'bg-primary/10 border-primary ring-primary ring-1'
							: 'bg-card border-border hover:border-primary/50'}"
					>
						<div class="mb-2 flex items-start justify-between">
							<Badge
								class={finding.severity === 'critical'
									? 'border-red-500/30 bg-red-500/20 text-red-500'
									: 'border-amber-500/30 bg-amber-500/20 text-amber-500'}
							>
								{finding.severity.toUpperCase()}
							</Badge>
							<div class="text-muted-foreground font-mono text-[10px]">
								Confidence: {Math.round(finding.confidence * 100)}%
							</div>
						</div>
						<h4 class="mb-1 text-sm leading-tight font-bold">{finding.title}</h4>
						<div class="text-muted-foreground flex items-center gap-2 text-[10px]">
							<Clock class="h-3 w-3" />
							{new Date(finding.timestamp).toLocaleTimeString()}
							<span class="opacity-30">|</span>
							<Fingerprint class="h-3 w-3" />
							{finding.mitre}
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Right: Detailed Evidence & Logs (Col 6-12) -->
		<div class="space-y-6 lg:col-span-7">
			{#if selectedFinding}
				<Card.Root class="bg-card/50 border-border">
					<Card.Header>
						<div class="flex items-start justify-between">
							<div>
								<Card.Title class="text-xl font-bold">{selectedFinding.title}</Card.Title>
								<Card.Description class="text-foreground/80 mt-2 leading-relaxed">
									{selectedFinding.description}
								</Card.Description>
							</div>
						</div>
					</Card.Header>
					<Card.Content class="space-y-6">
						<!-- Evidence Provenance -->
						<div class="grid grid-cols-3 gap-4">
							<div class="bg-muted/30 border-border rounded border p-3">
								<div class="text-muted-foreground text-[10px] uppercase">Log Source</div>
								<div class="mt-1 text-xs font-bold">{selectedFinding.sourceName}</div>
							</div>
							<div class="bg-muted/30 border-border rounded border p-3">
								<div class="text-muted-foreground text-[10px] uppercase">Trust Tier</div>
								<div class="mt-1 text-xs font-bold text-emerald-400">T1 (High Fidelity)</div>
							</div>
							<div class="bg-muted/30 border-border rounded border p-3">
								<div class="text-muted-foreground text-[10px] uppercase">MITRE Technique</div>
								<div class="mt-1 text-xs font-bold">{selectedFinding.mitreName}</div>
							</div>
						</div>

						<!-- Forensic Log Snippet (THE CORE FEATURE) -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<h5 class="text-primary flex items-center gap-2 text-xs font-bold uppercase">
									<Terminal class="h-4 w-4" /> Cryptographic Evidence Snippet
								</h5>
								<div class="flex items-center gap-2">
									<Badge
										class="gap-1 border-emerald-500/20 bg-emerald-500/10 font-mono text-[9px] text-emerald-500"
									>
										<ShieldCheck class="h-3 w-3" /> MERKLE VERIFIED
									</Badge>
								</div>
							</div>

							<div
								class="border-primary/20 relative overflow-hidden rounded-lg border bg-[#0a0a0c] font-mono text-[11px] leading-relaxed"
							>
								<!-- Evidence "Sealed" watermark -->
								<div class="pointer-events-none absolute top-2 right-2 opacity-20">
									<ShieldCheck class="text-primary h-12 w-12" />
								</div>

								<div class="overflow-x-auto p-4">
									{#each selectedFinding.logSnippet.lines as line}
										<div
											class="flex gap-4 {line.highlighted
												? 'bg-primary/20 text-primary-foreground border-primary -ml-4 border-l-2 pl-4'
												: 'opacity-60'}"
										>
											<span class="text-muted-foreground w-8 shrink-0 text-right"
												>{line.lineNo}</span
											>
											<span class="text-primary/60 w-24 shrink-0">{line.timestamp}</span>
											<span class="whitespace-pre">{line.raw}</span>
										</div>
									{/each}
								</div>

								<div
									class="bg-primary/5 border-primary/10 flex items-center justify-between border-t p-3"
								>
									<div class="text-muted-foreground max-w-[70%] truncate text-[9px]">
										Block Hash: <span class="text-primary/70"
											>{selectedFinding.logSnippet.blockHash}</span
										>
									</div>
									<div class="text-primary flex items-center gap-1 text-[9px] font-bold">
										<CheckCircle2 class="h-3 w-3" /> RSA-4096 SIGNED
									</div>
								</div>
							</div>
						</div>

						<!-- Reasoning Chain -->
						<div class="space-y-3">
							<h5 class="flex items-center gap-2 text-xs font-bold uppercase">
								<Brain class="h-4 w-4 text-purple-400" /> Neuro-Symbolic Reasoning Chain
							</h5>
							<div class="space-y-2">
								{#each selectedFinding.timeline as t}
									<div
										class="hover:bg-muted/30 hover:border-border flex items-center gap-3 rounded border border-transparent p-2 text-xs transition-colors"
									>
										<span class="text-muted-foreground w-14 shrink-0 font-mono">{t.time}</span>
										<div class="bg-border h-1.5 w-1.5 rounded-full"></div>
										<span class={t.event.includes('THIS EVENT') ? 'text-primary font-bold' : ''}
											>{t.event}</span
										>
									</div>
								{/each}
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	</main>
</div>
