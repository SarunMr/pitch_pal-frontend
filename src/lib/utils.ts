import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNPR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getDaysLeft(expiresAt?: string): number {
  if (!expiresAt) return 0;
  const days = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  return days > 0 ? days : 0;
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-orange-600';
}

export function getGradeColor(grade: string): string {
  if (grade === 'A') return 'text-green-600';
  if (grade === 'B') return 'text-yellow-600';
  return 'text-orange-600';
}
