// Main game state interface
export interface GameState {
  // === STORY PROGRESSION ===
  currentSceneId: string; // Which scene we're currently in
  currentDialogueIndex: number; // Which line of dialogue we're on
  sceneHistory: string[]; // Breadcrumb trail of visited scenes

  // === PLAYER DATA ===
  playerName: string;
  playerChoices: Record<string, any>; // Choices made by player

  // === STORY FLAGS & VARIABLES ===
  flags: Record<string, boolean>; // Story flags (metCharacter, solvedPuzzle)
  variables: Record<string, number>; // Counters, stats, affection points
  inventory: string[]; // Item IDs player has collected

  // === CHARACTER RELATIONSHIPS ===
  relationships: Record<string, number>; // characterId -> affection level

  // === UI STATE ===
  uiState: {
    isMenuOpen: boolean;
    isPaused: boolean;
    dialogueSpeed: number; // Text animation speed
    volume: number;
    autoAdvance: boolean; // Auto-advance dialogue
  };

  // === SAVE DATA ===
  saveSlots: SaveData[];
  currentSaveSlot: number;
}

// Save game data structure
export interface SaveData {
  id: number;
  timestamp: Date;
  sceneName: string;
  playerName: string;
  gameState: Partial<GameState>; // Snapshot of important state
}

// === STORE ACTIONS INTERFACE ===
export interface GameActions {
  // === SCENE NAVIGATION ===
  setCurrentScene: (sceneId: string) => void;
  setDialogueIndex: (index: number) => void;
  addToSceneHistory: (sceneId: string) => void;

  // === PLAYER DATA ===
  setPlayerName: (name: string) => void;
  setPlayerChoice: (choiceId: string, value: any) => void;

  // === FLAGS & VARIABLES ===
  setFlag: (flag: string, value: boolean) => void;
  setVariable: (variable: string, value: number) => void;
  incrementVariable: (variable: string, amount?: number) => void;
  addToInventory: (itemId: string) => void;
  removeFromInventory: (itemId: string) => void;

  // === RELATIONSHIPS ===
  setRelationship: (characterId: string, value: number) => void;
  adjustRelationship: (characterId: string, change: number) => void;

  // === UI ACTIONS ===
  toggleMenu: () => void;
  setPaused: (paused: boolean) => void;
  setDialogueSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  setAutoAdvance: (autoAdvance: boolean) => void;

  // === SAVE/LOAD ===
  saveGame: (slotId: number) => void;
  loadGame: (slotId: number) => void;

  // === UTILITY ===
  resetGame: () => void;
  getGameSnapshot: () => Partial<GameState>;
}
