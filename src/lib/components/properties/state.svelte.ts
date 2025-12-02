export const LAB_DURATION_MIN = 5 * 60;
export const LAB_DURATION_MAX = 4 * 60 * 60
export const LAB_ATTEMPTS_MIN = 0
export const LAB_ATTEMPTS_MAX = 10
export const LAB_POINTS_MIN = 0
export const LAB_POINTS_MAX = 100
export const LAB_LEVEL_EASY = 1
export const LAB_LEVEL_MEDIUM = 2
export const LAB_LEVEL_HARD = 3

export interface ILab {
  id: string;
  level: string;
  name: string;
  desc: string;
  attempts: number;
  points: number;
  duration: number;
  exported: number
}

export interface ILabData {
  [labId: string]: ILab;
}

export class ConfigProps implements ILab {
  id = $state('');
  name = $state('');
  desc = $state('');
  attempts = $state<number>(0);
  points = $state<number>(0);
  duration = $state<number>(0);
  level = $state<string>('');
  exported = $state<number>(0);
}
