export interface RankInfo {
  key: string;
  value: string;
}

export interface JournalResponse {
  code: number;
  msg: string;
  data: {
    customRank: {
      rankInfo: RankInfo[];
      rank: RankInfo[];
    };
    officialRank: {
      all: Record<string, string>;
      select: Record<string, string>;
    };
  };
}

export interface LocalJournalInfo {
  Name: string;
  'Abbr Name': string;
  ISSN: string;
  EISSN: string;
  JIF: string;
  JIF5Years: string;
  Category: string;
}

export interface SearchResult {
  source: 'local' | 'api';
  data: LocalJournalInfo | JournalResponse;
} 