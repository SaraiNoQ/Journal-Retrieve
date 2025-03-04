import type { LocalJournalInfo } from '@/types/journal';

let journalData: LocalJournalInfo[] | null = null;
let worker: Worker | null = null;
let loadingPromise: Promise<LocalJournalInfo[] | null> | null = null;

export async function loadJournalData(): Promise<LocalJournalInfo[] | null> {
  if (journalData) return journalData;
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    if (!worker) {
      worker = new Worker(new URL('../workers/excelWorker.ts', import.meta.url));
    }

    worker.onmessage = (e) => {
      if (e.data.type === 'success') {
        journalData = e.data.data;
        resolve(journalData);
      } else {
        console.error('加载Excel文件失败:', e.data.error);
        resolve(null);
      }
    };

    worker.onerror = (error) => {
      console.error('Worker错误:', error);
      resolve(null);
    };

    // 获取完整的文件URL
    const fileUrl = new URL('/ImpactFactor2024.xlsx', window.location.origin).href;
    worker.postMessage(fileUrl);
  });

  return loadingPromise;
}

export async function searchJournal(searchTerm: string): Promise<LocalJournalInfo | null> {
  const data = await loadJournalData();
  if (!data) return null;

  const searchTermLower = searchTerm.toLowerCase().trim();
  
  return data.find(journal => 
    journal.Name.toLowerCase().includes(searchTermLower)
    // || journal['Abbr Name'].toLowerCase().includes(searchTermLower) ||
    // journal.ISSN.includes(searchTerm) ||
    // journal.EISSN.includes(searchTerm)
  ) || null;
} 