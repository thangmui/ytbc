import { WritingStyle } from './types';

export const WRITING_STYLES: WritingStyle[] = [
  { value: 'creative_freedom', label: 'Tự do sáng tạo', description: 'No specific style; the AI has complete freedom to be creative based on the idea.' },
  { value: 'descriptive', label: 'Bài mô tả', description: 'A simple, direct style used to describe the characteristics of a subject, event, or brand. It is timeless and lacks argumentative elements.' },
  { value: 'narrative', label: 'Bài tường thuật', description: 'Includes a time element to summarize events that have happened in the past, like a press release or event recap.' },
  { value: 'interview', label: 'Bài phỏng vấn', description: 'Presents information from an interview or discussion, conveying a character\'s perspective or story in a concise format.' },
  { value: 'listicle', label: 'Bài liệt kê', description: 'A curated list of information, often presented from a specific viewpoint but without deep argumentation (e.g., "5 reasons why...", "8 secrets to...").' },
  { value: 'how_to', label: 'Bài hướng dẫn', description: 'A popular "how-to" format that describes the steps to perform a specific task, like a tutorial or guide.' },
  { value: 'storytelling', label: 'Bài kể chuyện', description: 'Tells a journey or transformation with a specific plot, including twists and climaxes to captivate the audience. This style is complex and uses various literary devices.' },
  { value: 'comparative_analysis', label: 'Bài phân tích so sánh', description: 'Analyzes and compares data, reports, or subjects, often across different timeframes (before/after, past/present). It combines data with viewpoints to draw conclusions.' },
  { value: 'problem_solution', label: 'Bài viết vấn đề – giải pháp', description: 'A persuasive style that presents a problem, highlights its negative consequences, and then offers a compelling solution. Often used in PR and product marketing.' },
  { value: 'bridging', label: 'Bài viết bắc cầu', description: 'Uses a credible, trusted element (like data, trends, or case studies) to build a connection to the main point the writer wants to make. It "bridges" a known concept to a new one.' },
];

export const TRANSLATION_LANGUAGES = [
  { code: 'en', name: 'Anh' },
  { code: 'es', name: 'Tây Ban Nha' },
  { code: 'pt', name: 'Bồ Đào Nha' },
  { code: 'fr', name: 'Pháp' },
  { code: 'zh', name: 'Trung Quốc' },
];