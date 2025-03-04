import * as XLSX from 'xlsx';

self.onmessage = async (e) => {
  try {
    const fileUrl = e.data; // 接收完整的文件URL
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    self.postMessage({ type: 'success', data });
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 