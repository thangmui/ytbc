export interface GenerationOptions {
  script: boolean;
  title: boolean;
  description: boolean;
  tags: boolean;
}

export interface ContentBlock {
  original: string;
  display: string;
}

export interface GenerationResult {
  script: ContentBlock;
  title: ContentBlock;
  description: ContentBlock;
  tags: ContentBlock;
}

export interface WritingStyle {
  value: string;
  label: string;
  description: string;
}
