export interface Strategy {
  id: number;
  name: string;
  spatulas: string[];
  level: string;
  prerequisites: string[];
  hans: string;
  description: string;
  links: string[];
}

export interface Method {
  id: number;
  name: string;
  strat: string;
  difficulty: string;
  description: string;
  videoURLs: string[];
}

export interface Spatula {
  id: number;
  pos: number;
  name: string;
  level: string;
  min_spatula_requirement: number;
}

export interface Sock {
  id: number;
  name: string;
  area?: string;
  level: string;
  min_spat_requirement: number;
}

export interface GlossaryEntry {
  id: number;
  name: string;
  difficulty: number;
  description: string;
  videoURL: string;
}

export interface Guide {
  id: number;
  name: string;
  difficulty: string;
  category: string;
  link: string;
}
