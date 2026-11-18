import { Locator } from '@playwright/test';

export function toPascalCase(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export type WaitForOptions = Parameters<Locator['waitFor']>[0];

export type Orientation = 'Portrait' | 'Landscape';
