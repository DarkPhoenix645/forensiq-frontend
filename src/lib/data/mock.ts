export const mockLogSources = [
	{
		id: 'src_001',
		name: 'prod-web-server-01',
		type: 'Linux Server',
		trustLevel: 'High',
		trustTier: 'T1',
		status: 'active',
		logsPerMin: 342,
		lastSeen: '2s ago',
		ip: '10.0.1.10',
		os: 'Ubuntu 22.04'
	},
	{
		id: 'src_002',
		name: 'prod-db-primary',
		type: 'Database Server',
		trustLevel: 'High',
		trustTier: 'T1',
		status: 'active',
		logsPerMin: 187,
		lastSeen: '5s ago',
		ip: '10.0.1.20',
		os: 'RHEL 9.1'
	},
	{
		id: 'src_003',
		name: 'aws-iam-cloudtrail',
		type: 'Cloud IAM',
		trustLevel: 'High',
		trustTier: 'T1',
		status: 'active',
		logsPerMin: 56,
		lastSeen: '12s ago',
		ip: 'AWS us-east-1',
		os: 'CloudTrail'
	},
	{
		id: 'src_004',
		name: 'corp-win-dc-01',
		type: 'Windows DC',
		trustLevel: 'High',
		trustTier: 'T1',
		status: 'active',
		logsPerMin: 423,
		lastSeen: '3s ago',
		ip: '10.0.0.5',
		os: 'Win Server 2022'
	},
	{
		id: 'src_005',
		name: 'nginx-load-balancer',
		type: 'App Server',
		trustLevel: 'Medium',
		trustTier: 'T2',
		status: 'active',
		logsPerMin: 1204,
		lastSeen: '1s ago',
		ip: '10.0.1.5',
		os: 'Ubuntu 20.04'
	},
	{
		id: 'src_006',
		name: 'iot-sensor-cluster-a',
		type: 'IoT Device',
		trustLevel: 'Low',
		trustTier: 'T3',
		status: 'warning',
		logsPerMin: 89,
		lastSeen: '45s ago',
		ip: '192.168.10.22',
		os: 'Embedded Linux'
	}
];

export const orgStats = {
	totalLogs24h: 4820441,
	activeAlerts: 12,
	integrityScore: 99.7,
	sourcesOnline: 5,
	sourcesTotal: 6,
	blocksSealed: 9648,
	lastSealedAt: '34s ago',
	investigationsActive: 1,
	investigationsTotal: 3
};

export const mockFindings = [
	{
		id: 'fnd_001',
		auditId: 'aud_001',
		severity: 'critical',
		confidence: 0.94,
		title: 'Credential Dumping via LSASS Memory Access',
		description:
			'Process mimikatz.exe (PID 4821) attempted to access lsass.exe memory at 02:14:33 UTC. This is consistent with MITRE ATT&CK T1003.001 - OS Credential Dumping.',
		mitre: 'T1003.001',
		mitreName: 'OS Credential Dumping',
		phase: 'Credential Access',
		sourceId: 'src_004',
		sourceName: 'corp-win-dc-01',
		timestamp: '2024-11-18T02:14:33Z',
		logSnippet: {
			lines: [
				{
					lineNo: 4821,
					timestamp: '02:14:31.204',
					raw: 'EventID=4688 SubjectUserName=svc-backup$ ProcessName=cmd.exe NewProcessName=m64.exe',
					highlighted: false
				},
				{
					lineNo: 4822,
					timestamp: '02:14:33.117',
					raw: 'EventID=10 SourceImage=m64.exe TargetImage=lsass.exe GrantedAccess=0x1fffff',
					highlighted: true
				},
				{
					lineNo: 4823,
					timestamp: '02:14:33.891',
					raw: 'EventID=4624 LogonType=9 TargetUserName=Administrator TargetDomainName=CORP',
					highlighted: true
				}
			],
			blockHash: 'sha256:a3f8c2d1e9b47f6a5c8d3e2b1a4f7c9e6d8b2a5f3c1e7d4b9a6f2c8e5d1b3a7f'
		},
		timeline: [
			{ time: '02:13:55', event: 'Backup service account authenticated via VPN' },
			{ time: '02:14:01', event: 'Unusual process spawn: cmd.exe → m64.exe' },
			{ time: '02:14:33', event: 'LSASS memory access detected (THIS EVENT)' },
			{ time: '02:14:34', event: 'Privilege escalation to Administrator' }
		]
	},
	{
		id: 'fnd_002',
		auditId: 'aud_001',
		severity: 'high',
		confidence: 0.88,
		title: 'Lateral Movement via Pass-the-Hash',
		description:
			'Successful NTLM authentication to prod-db-primary using a compromised administrator token within 40 seconds of the LSASS dump.',
		mitre: 'T1550.002',
		mitreName: 'Pass the Hash',
		phase: 'Lateral Movement',
		sourceId: 'src_002',
		sourceName: 'prod-db-primary',
		timestamp: '2024-11-18T02:15:12Z',
		logSnippet: {
			lines: [
				{
					lineNo: 18820,
					timestamp: '02:15:09.441',
					raw: 'sshd[18820]: Connection from 10.0.1.44 port 51204',
					highlighted: false
				},
				{
					lineNo: 18821,
					timestamp: '02:15:12.003',
					raw: 'sshd[18820]: Accepted publickey for root from 10.0.1.44 ssh2: RSA SHA256:***',
					highlighted: true
				}
			],
			blockHash: 'sha256:b7e3d9c4f1a8e5b2c6d4f9a1e3b7c5d2f8a4e6c9b3f1d7a5e2c8f4b1d9a6e3c7'
		},
		timeline: [
			{ time: '02:14:33', event: 'Credentials stolen from DC (fnd_001)' },
			{ time: '02:15:09', event: 'SSH connection attempt from 10.0.1.44' },
			{ time: '02:15:12', event: 'Root login accepted (THIS EVENT)' }
		]
	}
];
