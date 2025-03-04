import * as XLSX from 'xlsx';
import type { LocalJournalInfo } from '@/types/journal';

let journalData: LocalJournalInfo[] | null = null;

export async function loadJournalData() {
  if (journalData) return journalData;

  try {
    const response = await fetch('/ImpactFactor2024.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<LocalJournalInfo>(worksheet);
    journalData = data;
    return data;
  } catch (error) {
    console.error('加载Excel文件失败:', error);
    return null;
  }
}

export async function searchJournal(searchTerm: string): Promise<LocalJournalInfo | null> {
  const data = await loadJournalData();
  if (!data) return null;

  const searchTermLower = searchTerm.toLowerCase().trim();
  
  return data.find(journal => 
    journal.Name.toLowerCase().includes(searchTermLower) ||
    journal['Abbr Name'].toLowerCase().includes(searchTermLower) ||
    journal.ISSN.includes(searchTerm) ||
    journal.EISSN.includes(searchTerm)
  ) || null;
} 