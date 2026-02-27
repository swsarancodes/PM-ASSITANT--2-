export interface MigrationPhase {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  description: string;
  business_logic: string[];
  development_logic: string[];
  type?: 'input' | 'output' | 'default';
}

export interface VisualizationData {
  nodes: Array<{
    id: string;
    data: MigrationPhase;
    position: { x: number; y: number };
    type?: string;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    label?: string;
  }>;
}

export interface ProjectMetadata {
  title: string;
  scope: string;
  status: string;
  lastUpdated: string;
}
