export interface GenerationResponse {
  id: string;
  rootId?: string;
  version?: number;
  instruction?: string;
  prompt: string;
  summary: string;
  files: Record<string, string>;
  model?: string;
  createdAt: string;
  failedPages?: string[];
  newPage?: string;
}

export interface VersionItem {
  id: string;
  version: number;
  instruction?: string;
  createdAt: string;
}


export interface GenerationListItem {
  id: string;
  prompt: string;
  summary: string;
  model: string;
  fileCount: number;
  createdAt: string;
}

export interface GenerationsOverview {
  items: GenerationListItem[];
  stats: { total: number; tokens: number; lastGeneratedAt: string | null };
}


export interface Palette { primary: string; background: string; foreground: string }
export interface Brief { brandName?: string; context?: string }
export interface GenerateInput {
  prompt: string;
  multiPage: boolean;
  palette?: Palette;
  brief?: Brief;
}