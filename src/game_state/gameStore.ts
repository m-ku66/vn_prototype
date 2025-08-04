import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GameState, GameActions, SaveData } from "./gameStateTypes";

// === INITIAL STATE ===
const initialState: GameState = {
  currentSceneId: "intro", // Starting scene
  currentDialogueIndex: 0,
  sceneHistory: ["intro"],

  playerName: "",
  playerChoices: {},

  flags: {},
  variables: {},
  inventory: [],

  relationships: {},

  uiState: {
    isMenuOpen: false,
    isPaused: false,
    dialogueSpeed: 50, // Characters per second
    volume: 0.8,
    autoAdvance: false,
  },

  saveSlots: [],
  currentSaveSlot: 0,
};

export const useGameStore = create<GameState & GameActions>()(
  subscribeWithSelector((set, get) => ({
    // === INITIAL STATE ===
    ...initialState,

    // === SCENE NAVIGATION ACTIONS ===
    setCurrentScene: (sceneId: string) =>
      set((state) => ({
        currentSceneId: sceneId,
        currentDialogueIndex: 0,
        sceneHistory: [...state.sceneHistory, sceneId],
      })),

    setDialogueIndex: (index: number) => set({ currentDialogueIndex: index }),

    addToSceneHistory: (sceneId: string) =>
      set((state) => ({
        sceneHistory: [...state.sceneHistory, sceneId],
      })),

    // === PLAYER DATA ACTIONS ===
    setPlayerName: (name: string) => set({ playerName: name }),

    setPlayerChoice: (choiceId: string, value: any) =>
      set((state) => ({
        playerChoices: { ...state.playerChoices, [choiceId]: value },
      })),

    // === FLAGS & VARIABLES ACTIONS ===
    setFlag: (flag: string, value: boolean) =>
      set((state) => ({
        flags: { ...state.flags, [flag]: value },
      })),

    setVariable: (variable: string, value: number) =>
      set((state) => ({
        variables: { ...state.variables, [variable]: value },
      })),

    incrementVariable: (variable: string, amount: number = 1) =>
      set((state) => ({
        variables: {
          ...state.variables,
          [variable]: (state.variables[variable] || 0) + amount,
        },
      })),

    addToInventory: (itemId: string) =>
      set((state) => ({
        inventory: [...state.inventory, itemId],
      })),

    removeFromInventory: (itemId: string) =>
      set((state) => ({
        inventory: state.inventory.filter((item) => item !== itemId),
      })),

    // === RELATIONSHIP ACTIONS ===
    setRelationship: (characterId: string, value: number) =>
      set((state) => ({
        relationships: { ...state.relationships, [characterId]: value },
      })),

    adjustRelationship: (characterId: string, change: number) =>
      set((state) => ({
        relationships: {
          ...state.relationships,
          [characterId]: (state.relationships[characterId] || 0) + change,
        },
      })),

    // === UI ACTIONS ===
    toggleMenu: () =>
      set((state) => ({
        uiState: { ...state.uiState, isMenuOpen: !state.uiState.isMenuOpen },
      })),

    setPaused: (paused: boolean) =>
      set((state) => ({
        uiState: { ...state.uiState, isPaused: paused },
      })),

    setDialogueSpeed: (speed: number) =>
      set((state) => ({
        uiState: { ...state.uiState, dialogueSpeed: speed },
      })),

    setVolume: (volume: number) =>
      set((state) => ({
        uiState: { ...state.uiState, volume: volume },
      })),

    setAutoAdvance: (autoAdvance: boolean) =>
      set((state) => ({
        uiState: { ...state.uiState, autoAdvance: autoAdvance },
      })),

    // === SAVE/LOAD ACTIONS ===
    saveGame: (slotId: number) => {
      const state = get();
      const saveData: SaveData = {
        id: slotId,
        timestamp: new Date(),
        sceneName: state.currentSceneId, // We'd get scene name from Scene Manager
        playerName: state.playerName,
        gameState: {
          currentSceneId: state.currentSceneId,
          currentDialogueIndex: state.currentDialogueIndex,
          playerName: state.playerName,
          flags: state.flags,
          variables: state.variables,
          inventory: state.inventory,
          relationships: state.relationships,
        },
      };

      set((state) => ({
        saveSlots: [
          ...state.saveSlots.filter((s) => s.id !== slotId),
          saveData,
        ],
        currentSaveSlot: slotId,
      }));

      // Also save to localStorage
      localStorage.setItem(`vn_save_${slotId}`, JSON.stringify(saveData));
    },

    loadGame: (slotId: number) => {
      const saveData = localStorage.getItem(`vn_save_${slotId}`);
      if (saveData) {
        const parsed: SaveData = JSON.parse(saveData);
        set((state) => ({
          ...state,
          ...parsed.gameState,
          currentSaveSlot: slotId,
        }));
      }
    },

    // === UTILITY ACTIONS ===
    resetGame: () => set(initialState),

    getGameSnapshot: () => {
      const state = get();
      return {
        currentSceneId: state.currentSceneId,
        currentDialogueIndex: state.currentDialogueIndex,
        playerName: state.playerName,
        flags: state.flags,
        variables: state.variables,
        inventory: state.inventory,
        relationships: state.relationships,
      };
    },
  }))
);
