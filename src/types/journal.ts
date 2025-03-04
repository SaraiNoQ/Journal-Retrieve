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