
export interface Scene {
  sceneNumber: number;
  setting: string;
  description: string;
  veoPrompt: string;
}

export interface Script {
  title: string;
  description: string;
  scenes: Scene[];
}

export type AspectRatio = '16:9' | '9:16';

export enum Tab {
  GENERATE_SCRIPT = 'Tạo Kịch Bản',
  RENDER_VIDEO = 'Tạo Video',
}
