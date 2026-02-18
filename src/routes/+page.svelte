<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Shield,
		Zap,
		Lock,
		Brain,
		GitBranch,
		ArrowRight,
		CheckCircle,
		XCircle,
		Server,
		Eye,
		FileText,
		AlertTriangle,
		Search
	} from '@lucide/svelte';
	import logoPng from '$lib/assets/logo.png';

	// ── Animated counters ────────────────────────────────────────────────────
	let logsCount = $state(0);
	let integrityCount = $state(0);
	let blocksCount = $state(0);
	let confidenceCount = $state(0);
	let countersStarted = $state(false);

	function animateTo(setter: (v: number) => void, target: number, duration: number = 2000) {
		const start = performance.now();
		const tick = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			// Ease out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			setter(Math.floor(eased * target));
			if (progress < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	}

	// ── Intersection observer for scroll-triggered animations ────────────────
	onMount(() => {
		const metricsEl = document.getElementById('metrics');
		if (!metricsEl) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !countersStarted) {
					countersStarted = true;
					animateTo((v) => (logsCount = v), 4820441, 2200);
					animateTo((v) => (integrityCount = v), 997, 1800);
					animateTo((v) => (blocksCount = v), 9648, 2000);
					animateTo((v) => (confidenceCount = v), 94, 1400);
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(metricsEl);
		return () => observer.disconnect();
	});

	// ── Static data ──────────────────────────────────────────────────────────
	const features = [
		{
			icon: Shield,
			title: 'Dual-Pipeline Architecture',
			description:
				'Hot Path for real-time AI analysis. Cold Path for cryptographic evidence sealing. Both run simultaneously — neither ever compromises the other.',
			color: 'text-blue-400',
			bg: 'bg-blue-400/10',
			border: 'border-blue-400/20'
		},
		{
			icon: Lock,
			title: 'Merkle Chain Integrity',
			description:
				'Every log block is SHA-256 hashed, RSA-4096 signed, and chained. Tampering is mathematically impossible to conceal — down to the millisecond.',
			color: 'text-emerald-400',
			bg: 'bg-emerald-400/10',
			border: 'border-emerald-400/20'
		},
		{
			icon: Brain,
			title: 'Neuro-Symbolic AI',
			description:
				'Streaming anomaly detection fused with deterministic rule logic. Every hypothesis is explainable, traceable, and mapped to MITRE ATT&CK.',
			color: 'text-purple-400',
			bg: 'bg-purple-400/10',
			border: 'border-purple-400/20'
		},
		{
			icon: Eye,
			title: 'Trust-Aware Ingestion',
			description:
				'Kernel logs are not equal to IoT telemetry. ForensIQ classifies every source at ingestion — weighting evidence by its reliability tier automatically.',
			color: 'text-amber-400',
			bg: 'bg-amber-400/10',
			border: 'border-amber-400/20'
		},
		{
			icon: GitBranch,
			title: 'Anti-Time-Stomping',
			description:
				'Overlapping temporal windows cross-validate timestamps across all sources. Clock manipulation is flagged as forensic evidence, not dismissed as noise.',
			color: 'text-red-400',
			bg: 'bg-red-400/10',
			border: 'border-red-400/20'
		},
		{
			icon: FileText,
			title: 'Court-Ready Dossiers',
			description:
				'Export fully auditable forensic reports with chain-of-custody tables, signed evidence IDs, and human-verified reasoning for legal proceedings.',
			color: 'text-cyan-400',
			bg: 'bg-cyan-400/10',
			border: 'border-cyan-400/20'
		}
	];

	const problems = [
		'Log tampering silently erases attack evidence',
		'Timestamp manipulation hides the real attack timeline',
		'Black-box AI creates legal liability in court',
		'SIEMs contaminate evidence during re-indexing',
		'Manual triage delays breach response by hours',
		'Cloud logs evaporate before forensics even begins'
	];

	const solutions = [
		'Merkle-chained immutable evidence blocks',
		'Overlapping integrity windows detect time-stomping',
		'Explainable neuro-symbolic reasoning engine',
		'Cryptographically isolated dual-pipeline',
		'Pre-ranked AI hypotheses cut triage to minutes',
		'Streaming forensic sealing at ingestion time'
	];

	const pipeline = [
		{
			id: 'P-01',
			title: 'Trust-Aware Acquisition',
			desc: 'Agents collect from any source — cloud, on-prem, IoT — and tag each log with a trust tier at the point of ingestion.',
			icon: Server
		},
		{
			id: 'P-02',
			title: 'Dual-Path Bifurcation',
			desc: 'Traffic splits at the Logstash gateway. Hot Path feeds real-time intelligence. Cold Path feeds cryptographic sealing. Never the reverse.',
			icon: GitBranch
		},
		{
			id: 'P-03',
			title: 'Forensic Integrity Sealing',
			desc: 'Raw logs are grouped, SHA-256 hashed into Merkle blocks, RSA-4096 signed, and timestamped via RFC 3161. Immutable by design.',
			icon: Lock
		},
		{
			id: 'P-04',
			title: 'Real-Time Intelligence Indexing',
			desc: 'The operational stream is normalized to OCSF and indexed into Elasticsearch for sub-second search and vector lookups.',
			icon: Zap
		},
		{
			id: 'P-05',
			title: 'Neuro-Symbolic Hypothesis Generation',
			desc: 'River ML streaming anomaly detection fuses with YAML-rule symbolic logic under the Fusion Policy Layer to generate ranked, explainable findings.',
			icon: Brain
		},
		{
			id: 'P-06',
			title: 'Investigator Reasoning & Provenance',
			desc: 'Analysts query findings in plain English via RAG-LLM. Every answer links to a verified log ID. All decisions are immutably logged.',
			icon: Search
		}
	];

	const comparisons = [
		{
			tool: 'Splunk SIEM',
			integrity: false,
			streaming: true,
			explainable: false,
			courtReady: false
		},
		{
			tool: 'EnCase Forensics',
			integrity: true,
			streaming: false,
			explainable: false,
			courtReady: true
		},
		{
			tool: 'Prophet Security',
			integrity: false,
			streaming: true,
			explainable: false,
			courtReady: false
		},
		{
			tool: 'AWS CloudTrail',
			integrity: false,
			streaming: true,
			explainable: false,
			courtReady: false
		},
		{ tool: 'ForensIQ', integrity: true, streaming: true, explainable: true, courtReady: true }
	];

	const sectors = [
		{ name: 'BFSI', desc: 'Fraud investigation & insider misuse', color: 'text-amber-400' },
		{ name: 'Defense', desc: 'Air-gapped, sovereign deployment', color: 'text-red-400' },
		{ name: 'Healthcare', desc: 'Patient data breach investigation', color: 'text-emerald-400' },
		{ name: 'Telecom', desc: 'Signalling abuse attribution', color: 'text-blue-400' },
		{ name: 'GovTech', desc: 'Multi-cloud forensic readiness', color: 'text-purple-400' },
		{ name: 'Enterprise', desc: 'SOC-to-courtroom capability', color: 'text-cyan-400' }
	];
</script>

<svelte:head>
	<title>ForensIQ | AI-Powered Cyber Forensics</title>
</svelte:head>

<div class="bg-background text-foreground min-h-screen overflow-x-hidden">
	<!-- ── Navbar ─────────────────────────────────────────────────────────── -->
	<header
		class="border-border/50 bg-background/80 fixed inset-x-0 top-0 z-50 flex items-center justify-between
               border-b px-6 py-4 backdrop-blur-md"
	>
		<!-- Logo -->
		<a href="/" class="group flex items-center gap-2">
			<div
				class="border-primary/20 bg-card group-hover:border-primary/50 relative h-10 w-10 overflow-hidden rounded-lg border p-1 transition-colors"
			>
				<img src={logoPng} alt="ForensIQ Logo" class="h-full w-full object-contain" />
			</div>
			<span class="text-xl font-bold tracking-tight">
				<span class="text-foreground">Forens</span><span class="text-primary glow-text">IQ</span>
			</span>
		</a>

		<!-- Nav links -->
		<nav class="text-muted-foreground hidden items-center gap-8 text-sm md:flex">
			<a href="#metrics" class="hover:text-foreground transition-colors">Impact</a>
			<a href="#features" class="hover:text-foreground transition-colors">Features</a>
			<a href="#pipeline" class="hover:text-foreground transition-colors">How It Works</a>
			<a href="#compare" class="hover:text-foreground transition-colors">Comparison</a>
		</nav>

		<div class="flex items-center gap-3">
			<Button variant="ghost" size="sm" onclick={() => goto('/auth')}>Sign In</Button>
			<Button size="sm" class="glow-primary" onclick={() => goto('/auth?mode=signup')}>
				Get Started
				<ArrowRight class="ml-1.5 h-3.5 w-3.5" />
			</Button>
		</div>
	</header>

	<!-- ── Hero ──────────────────────────────────────────────────────────── -->
	<section
		class="grid-bg relative flex min-h-screen flex-col items-center justify-center px-6 pt-24"
	>
		<!-- Scan line -->
		<div
			class="scan-line via-primary/25 pointer-events-none absolute
                   inset-x-0 h-px bg-linear-to-r from-transparent
                   to-transparent"
		></div>

		<!-- Radial glow -->
		<div
			class="pointer-events-none absolute inset-0"
			style="background: radial-gradient(ellipse 80% 50% at 50% 40%, oklch(0.65 0.2 220 / 0.06) 0%, transparent 70%);"
		></div>

		<div class="relative z-10 mx-auto max-w-5xl space-y-8 text-center">
			<!-- Live badge -->
			<div
				class="fade-in-up border-primary/30 bg-primary/5 text-primary inline-flex items-center gap-2
                        rounded-full border px-3 py-1.5 text-xs font-medium"
			>
				<span class="relative flex h-2 w-2">
					<span
						class="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
					></span>
					<span class="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
				</span>
				DSCI Cyber Innovation Challenge · Team editedit · ABV-IIITM Gwalior
			</div>

			<!-- Headline -->
			<h1
				class="fade-in-up text-5xl leading-[1.05] font-black tracking-tight delay-100 md:text-7xl"
			>
				<span class="text-foreground">Cyber Forensics.</span><br />
				<span class="text-primary glow-text">Legally Defensible.</span>
			</h1>

			<!-- Subheadline -->
			<p
				class="fade-in-up text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed delay-200 md:text-xl"
			>
				ForensIQ is the first end-to-end log investigation framework that delivers
				<strong class="text-foreground font-semibold">AI-speed analysis</strong>
				without sacrificing
				<strong class="text-foreground font-semibold">cryptographic evidence integrity</strong>.
				Built for the courtroom, not just the SOC.
			</p>

			<!-- Typewriter terminal line -->
			<div class="fade-in-up flex justify-center delay-300">
				<span class="typewriter text-primary/70 text-left font-mono text-sm">
					[SYSTEM] Merkle block sealed · SHA-256 verified · RSA-4096 signed · RFC-3161 ✓
				</span>
			</div>

			<!-- CTAs -->
			<div class="fade-in-up flex flex-col justify-center gap-4 delay-400 sm:flex-row">
				<Button
					size="lg"
					class="glow-primary h-12 px-8 text-base"
					onclick={() => goto('/auth?mode=signup')}
				>
					Start Free Investigation
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="lg"
					class="border-border h-12 px-8 text-base"
					onclick={() => goto('/auth')}
				>
					Sign In to Dashboard
				</Button>
			</div>

			<!-- Trust strip -->
			<div
				class="fade-in-up border-border/40 flex flex-col items-center gap-4 border-t pt-8 delay-500"
			>
				<p class="text-muted-foreground text-xs tracking-widest uppercase">
					Designed for critical infrastructure
				</p>
				<div class="flex flex-wrap justify-center gap-3">
					{#each sectors as s}
						<span
							class="border-border/60 bg-card/50 rounded border px-3 py-1 font-mono
                                   text-xs {s.color} hover:border-primary/40 cursor-default transition-colors"
						>
							{s.name}
						</span>
					{/each}
				</div>
			</div>
		</div>

		<!-- Scroll cue -->
		<div
			class="text-muted-foreground/40 absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
		>
			<span class="text-xs">scroll</span>
			<div class="from-muted-foreground/40 h-8 w-px bg-linear-to-b to-transparent"></div>
		</div>
	</section>

	<!-- ── Metrics ───────────────────────────────────────────────────────── -->
	<section id="metrics" class="border-border/50 bg-card/20 border-y px-6 py-28">
		<div class="mx-auto max-w-6xl space-y-16">
			<div class="space-y-4 text-center">
				<Badge variant="outline" class="border-primary/30 text-primary text-xs">
					The Scale of the Problem
				</Badge>
				<h2 class="text-3xl font-bold md:text-4xl">
					Modern breaches generate millions of logs.<br />
					<span class="text-muted-foreground font-normal"
						>Traditional tools weren't built for this.</span
					>
				</h2>
			</div>

			<!-- Counter cards -->
			<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{#each [{ value: logsCount.toLocaleString(), label: 'Logs / day', sub: 'in a typical enterprise deployment', color: 'text-primary' }, { value: (integrityCount / 10).toFixed(1) + '%', label: 'Integrity verification rate', sub: 'cryptographically proven', color: 'text-emerald-400' }, { value: blocksCount.toLocaleString(), label: 'Evidence blocks sealed', sub: 'across demo environment', color: 'text-blue-400' }, { value: confidenceCount + '%', label: 'AI hypothesis confidence', sub: 'on critical severity findings', color: 'text-purple-400' }] as m}
					<div
						class="border-border bg-card hover:border-primary/30 space-y-2 rounded-xl
                               border p-6 text-center transition-colors"
					>
						<div class="font-mono text-3xl font-black md:text-4xl {m.color}">
							{m.value}
						</div>
						<div class="text-sm font-semibold">{m.label}</div>
						<div class="text-muted-foreground text-xs">{m.sub}</div>
					</div>
				{/each}
			</div>

			<!-- Problem vs Solution -->
			<div class="grid gap-6 md:grid-cols-2">
				<div class="border-destructive/20 bg-destructive/5 space-y-4 rounded-xl border p-6">
					<div class="flex items-center gap-2">
						<AlertTriangle class="text-destructive h-4 w-4" />
						<h3 class="text-destructive font-semibold">Without ForensIQ</h3>
					</div>
					<ul class="space-y-3">
						{#each problems as p}
							<li class="text-muted-foreground flex items-start gap-3 text-sm">
								<XCircle class="text-destructive/70 mt-0.5 h-4 w-4 shrink-0" />
								{p}
							</li>
						{/each}
					</ul>
				</div>

				<div class="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
					<div class="flex items-center gap-2">
						<CheckCircle class="h-4 w-4 text-emerald-400" />
						<h3 class="font-semibold text-emerald-400">ForensIQ's guarantees</h3>
					</div>
					<ul class="space-y-3">
						{#each solutions as s}
							<li class="text-muted-foreground flex items-start gap-3 text-sm">
								<CheckCircle class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/70" />
								{s}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- ── Features ──────────────────────────────────────────────────────── -->
	<section id="features" class="px-6 py-28">
		<div class="mx-auto max-w-6xl space-y-16">
			<div class="space-y-4 text-center">
				<Badge variant="outline" class="border-primary/30 text-primary text-xs">
					Core Capabilities
				</Badge>
				<h2 class="text-3xl font-bold md:text-4xl">Built different. Proven in court.</h2>
				<p class="text-muted-foreground mx-auto max-w-2xl">
					Every feature exists for a reason: to ensure your forensic investigation is faster,
					smarter, and legally unassailable.
				</p>
			</div>

			<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				{#each features as feat}
					<div
						class="rounded-xl border p-6 {feat.border} bg-card
                               hover:border-opacity-60 group
                               space-y-4 transition-all duration-300 hover:-translate-y-0.5"
					>
						<div
							class="h-10 w-10 rounded-lg {feat.bg} {feat.border} flex
                                   items-center justify-center border
                                   transition-transform group-hover:scale-110"
						>
							<feat.icon class="h-5 w-5 {feat.color}" />
						</div>
						<div class="space-y-2">
							<h3 class="font-semibold">{feat.title}</h3>
							<p class="text-muted-foreground text-sm leading-relaxed">
								{feat.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Pipeline walkthrough ───────────────────────────────────────────── -->
	<section id="pipeline" class="bg-card/20 border-border/50 border-y px-6 py-28">
		<div class="mx-auto max-w-4xl space-y-16">
			<div class="space-y-4 text-center">
				<Badge variant="outline" class="border-primary/30 text-primary text-xs">
					Six-Phase Pipeline
				</Badge>
				<h2 class="text-3xl font-bold md:text-4xl">From raw log to signed evidence.</h2>
				<p class="text-muted-foreground">
					Every phase maps to a specific forensic objective. Nothing is implicit.
				</p>
			</div>

			<div class="relative space-y-0">
				{#each pipeline as phase, i}
					<div class="flex gap-6">
						<!-- Spine -->
						<div class="flex flex-col items-center">
							<div
								class="border-primary bg-primary/10 text-primary z-10 flex h-10
                                       w-10 shrink-0 items-center justify-center
                                       rounded-full border-2 font-mono text-xs font-bold"
							>
								{phase.id}
							</div>
							{#if i < pipeline.length - 1}
								<div
									class="from-primary/40 to-primary/10 my-1 min-h-8 w-px flex-1 bg-linear-to-b"
								></div>
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-1 space-y-1 pt-1.5 pb-8">
							<div class="flex items-center gap-3">
								<phase.icon class="text-primary h-4 w-4" />
								<h3 class="font-semibold">{phase.title}</h3>
							</div>
							<p class="text-muted-foreground pl-7 text-sm leading-relaxed">
								{phase.desc}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Comparison table ───────────────────────────────────────────────── -->
	<section id="compare" class="px-6 py-28">
		<div class="mx-auto max-w-5xl space-y-16">
			<div class="space-y-4 text-center">
				<Badge variant="outline" class="border-primary/30 text-primary text-xs">Comparison</Badge>
				<h2 class="text-3xl font-bold md:text-4xl">No other tool closes all four gaps.</h2>
				<p class="text-muted-foreground mx-auto max-w-2xl">
					Existing solutions force a trade-off between operational speed and forensic integrity.
					ForensIQ is the only platform that refuses to make that compromise.
				</p>
			</div>

			<div class="border-border overflow-hidden rounded-xl border">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-border bg-muted/30 border-b">
							<th class="text-muted-foreground px-6 py-4 text-left font-medium">Tool</th>
							<th class="text-muted-foreground px-4 py-4 text-center font-medium">
								Evidence Integrity
							</th>
							<th class="text-muted-foreground px-4 py-4 text-center font-medium">
								Streaming Analysis
							</th>
							<th class="text-muted-foreground px-4 py-4 text-center font-medium">
								Explainable AI
							</th>
							<th class="text-muted-foreground px-4 py-4 text-center font-medium"> Court Ready </th>
						</tr>
					</thead>
					<tbody>
						{#each comparisons as row, i}
							<tr
								class="border-border/50 border-b last:border-0
                                       {row.tool === 'ForensIQ'
									? 'bg-primary/5 border-primary/20'
									: 'hover:bg-muted/20'} transition-colors"
							>
								<td class="px-6 py-4 font-medium {row.tool === 'ForensIQ' ? 'text-primary' : ''}">
									{row.tool}
									{#if row.tool === 'ForensIQ'}
										<Badge class="bg-primary/20 text-primary border-primary/30 ml-2 border text-xs">
											our solution
										</Badge>
									{/if}
								</td>
								{#each [row.integrity, row.streaming, row.explainable, row.courtReady] as val}
									<td class="px-4 py-4 text-center">
										{#if val}
											<CheckCircle class="mx-auto h-4 w-4 text-emerald-400" />
										{:else}
											<XCircle class="text-destructive/50 mx-auto h-4 w-4" />
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- ── Sector use cases ───────────────────────────────────────────────── -->
	<section class="bg-card/20 border-border/50 border-t px-6 py-28">
		<div class="mx-auto max-w-5xl space-y-16">
			<div class="space-y-4 text-center">
				<Badge variant="outline" class="border-primary/30 text-primary text-xs">
					Target Sectors
				</Badge>
				<h2 class="text-3xl font-bold md:text-4xl">Built for India's critical infrastructure.</h2>
			</div>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each sectors as s}
					<div
						class="border-border bg-card hover:border-primary/30 group rounded-xl
                               border p-5 transition-colors"
					>
						<div class="text-lg font-bold {s.color} mb-1">{s.name}</div>
						<div class="text-muted-foreground text-sm">{s.desc}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Final CTA ──────────────────────────────────────────────────────── -->
	<section class="relative overflow-hidden px-6 py-32 text-center">
		<div
			class="pointer-events-none absolute inset-0"
			style="background: radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.65 0.2 220 / 0.07) 0%, transparent 70%);"
		></div>
		<div class="relative z-10 mx-auto max-w-3xl space-y-8">
			<h2 class="text-4xl leading-tight font-black md:text-5xl">
				Your next breach investigation<br />
				<span class="text-primary glow-text">deserves better.</span>
			</h2>
			<p class="text-muted-foreground mx-auto max-w-xl text-lg">
				Stop losing cases because your evidence pipeline wasn't built for court. ForensIQ is free,
				on-premise, and legally defensible from day one.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<Button
					size="lg"
					class="glow-primary h-12 px-10 text-base"
					onclick={() => goto('/auth?mode=signup')}
				>
					Deploy ForensIQ Now
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="lg"
					class="border-border h-12 px-8 text-base"
					onclick={() => goto('/auth')}
				>
					Sign In
				</Button>
			</div>
		</div>
	</section>

	<!-- ── Footer ─────────────────────────────────────────────────────────── -->
	<footer class="border-border/50 border-t px-6 py-8">
		<div
			class="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center
                   justify-between gap-4 text-sm md:flex-row"
		>
			<a href="/" class="flex items-center gap-2">
				<span class="font-bold">
					<span class="text-foreground">Forens</span><span class="text-primary">IQ</span>
				</span>
			</a>
			<span>Team editedit · ABV-IIITM Gwalior · DSCI Cyber Innovation Challenge v1.0</span>
			<span class="font-mono text-xs">ISO 27037 · NIST SP 800-92 · RFC 3161</span>
		</div>
	</footer>
</div>
