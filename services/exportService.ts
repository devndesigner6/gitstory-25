import { GitStoryData } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export functionality for GitStory
 */

export interface ExportOptions {
  format: 'png' | 'pdf' | 'jpg';
  quality?: number;
  scale?: number;
}

/**
 * Export current slide or entire story as PNG
 */
export async function exportAsPNG(
  elementId: string,
  filename: string = 'gitstory'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found for export');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#000000',
      useCORS: true,
      logging: false,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${filename}-${new Date().getTime()}.png`;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw error;
  }
}

/**
 * Export as PDF document
 */
export async function exportAsPDF(
  elementId: string,
  filename: string = 'gitstory'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found for export');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#000000',
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}-${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
}

/**
 * Export as JPG image
 */
export async function exportAsJPG(
  elementId: string,
  filename: string = 'gitstory',
  quality: number = 0.95
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found for export');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#000000',
      useCORS: true,
      logging: false,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg', quality);
    link.download = `${filename}-${new Date().getTime()}.jpg`;
    link.click();
  } catch (error) {
    console.error('Failed to export JPG:', error);
    throw error;
  }
}

/**
 * Generate shareable link with data encoded
 */
export function generateShareableLink(username: string, token?: string): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();
  params.append('username', username);
  if (token) {
    params.append('token', token);
  }
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
