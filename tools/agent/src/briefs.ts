export type NormalizedTestBrief = {
  testId?: string;
  title: string;
  domain?: string;
  tags?: string[];
  source: string;
  actor?: string;
  fedRampSupport?: string;
  preconditions?: string[];
  steps?: string[];
  assertions?: string[];
  cleanup?: string;
  referenceUrl?: string;
  notes?: string;
  rawText?: string;
};

export function extractTestIdFromText(text: string): string | undefined {
  const match = /\b(test-\d+)\b/i.exec(text);
  if (!match) {
    return undefined;
  }
  const digits = match[1].slice(5);
  return `Test-${digits}`;
}

export function normalizeTag(rawTag: string): string {
  const trimmed = rawTag.trim();
  if (!trimmed) {
    return '';
  }
  const clean = trimmed.replace(/^@+/, '');
  const lower = clean.toLowerCase();
  if (lower === 'notfedramp' || lower === 'not-fedramp') {
    return '@notfedramp';
  }
  if (lower === 'snapshot') {
    return '@snapshot';
  }
  return `@${lower}`;
}

export function splitListValues(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(v => String(v ?? '').trim()).filter(Boolean);
  }
  if (typeof raw !== 'string') {
    return [];
  }

  const trimmed = raw.trim();
  if (!trimmed || /^(?:none|n\/a|-)$/i.test(trimmed)) {
    return [];
  }

  const delimiter = trimmed.includes('\n') ? /\r?\n/ : /\s*;\s*/;
  return trimmed
    .split(delimiter)
    .map(item =>
      item
        .trim()
        .replace(/^\d+[.)]\s+/, '')
        .replace(/^[-*•]\s+/, '')
        .trim()
    )
    .filter(Boolean);
}

export function formatBriefHeadline(brief: NormalizedTestBrief): string {
  const cleanTitle = brief.title.trim() || 'Automated test scenario';
  if (!brief.testId) {
    return cleanTitle;
  }
  const startsWithId = cleanTitle.toLowerCase().startsWith(brief.testId.toLowerCase());
  return startsWithId ? cleanTitle : `${brief.testId} ${cleanTitle}`;
}

export function formatBriefAsMarkdown(brief: NormalizedTestBrief): string {
  const lines: string[] = [
    '## Test Brief',
    '',
    `- **Test ID**: ${brief.testId ?? 'Unspecified'}`,
    `- **Title**: ${brief.title.trim()}`,
    `- **Domain**: ${brief.domain?.trim() || 'Infer from catalog'}`,
    `- **Tags**: ${brief.tags && brief.tags.length > 0 ? brief.tags.join(', ') : 'none'}`,
    `- **Source**: ${brief.source}`,
  ];

  if (brief.actor || brief.fedRampSupport) {
    lines.push('', '### Persona & Isolation', '');
    if (brief.actor) {
      lines.push(`- **Actor**: ${brief.actor}`);
    }
    if (brief.fedRampSupport) {
      lines.push(`- **FedRAMP Support**: ${brief.fedRampSupport}`);
    }
  }

  if (brief.preconditions && brief.preconditions.length > 0) {
    lines.push('', '### Preconditions / Seed Data', '');
    brief.preconditions.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item}`);
    });
  }

  if (brief.steps && brief.steps.length > 0) {
    lines.push('', '### Steps', '');
    brief.steps.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item}`);
    });
  }

  if (brief.assertions && brief.assertions.length > 0) {
    lines.push('', '### Expected Assertions', '');
    brief.assertions.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item}`);
    });
  }

  if (brief.cleanup) {
    lines.push('', '### Cleanup', '', `- ${brief.cleanup}`);
  }

  if (brief.notes) {
    lines.push('', '### Notes', '', brief.notes.trim());
  }

  if (brief.rawText && brief.rawText.trim()) {
    lines.push('', '### Source Details', '', brief.rawText.trim());
  }

  return `${lines.join('\n')}\n`;
}
