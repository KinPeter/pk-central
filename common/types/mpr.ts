export interface MprConfig {
  profiles: GameProfile[];
}

export interface GameProfile {
  name: string;
  shortName: string;
  abbreviation: string;
  keywords: string[];
  bindings: KeyBindings;
  isDefault?: boolean;
}

export interface KeyBindings {
  left: string; // 0
  right: string; // 1
  middle: string; // 2
  leftSideFirst: string; // 3
  leftSideSecond: string; // 4
  leftSideFarDown: string; // 5
  topLeftFirst: string; // 6
  topLeftSecond: string; // 7
  topMiddleSmall: string; // 8
  wheelRight: string; // 9
  wheelLeft: string; // 10
}

export interface CurrentProfile {
  activeProfile: number;
  configuredGame: GameProfile;
}

export type MprData = CurrentProfile & MprConfig;

export interface ChangeProfileRequest {
  abbreviation: string | null;
  profileNumber: number | null;
}
