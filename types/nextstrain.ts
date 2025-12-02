export interface NextstrainNode {
  node_attrs?: {
    clade?: { value: string };
    country?: { value: string };
    date?: { value: string };
  };
  children?: NextstrainNode[];
}

export interface NextstrainData {
  tree: NextstrainNode;
  meta?: any;
}

export interface NextstrainProcessed {
  clades: Array<{ name: string; count: number }>;
  locations: Array<{ name: string; count: number }>;
  timeline: Array<{ date: string; count: number }>;
  lastUpdated: string;
}
