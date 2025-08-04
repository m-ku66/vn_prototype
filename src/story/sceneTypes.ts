import { GameState } from "src/game_state/gameStateTypes";
import {
  CharacterExpression,
  CharacterPosition,
} from "src/story/characterTypes";

type TextEffect = "shake" | "bold" | "italic" | "color";
type SceneEffect = "fade" | "shake" | "zoom";

// Main story scene structure
export interface Scene {
  id: string; // Unique identifier
  name: string; // Human-readable name

  // === VISUAL ELEMENTS ===
  background: string; // Background image path
  music?: string; // Background music
  ambientSound?: string; // Rain, birds, etc.

  // === CHARACTERS ON SCREEN ===
  characters: CharacterPosition[]; // Who's visible and where

  // === DIALOGUE CONTENT ===
  dialogue: DialogueLine[]; // The actual story content

  // === BRANCHING LOGIC ===
  choices?: Choice[]; // Player choices at end of scene
  autoAdvance?: boolean; // Skip to next scene automatically

  // === CONDITIONS ===
  unlockCondition?: (state: GameState) => boolean; // Can player access this?
  onEnter?: (state: GameState) => void; // Run when entering scene
  onExit?: (state: GameState) => void; // Run when leaving scene
}

// Individual dialogue line
export interface DialogueLine {
  id: string;
  speaker?: string; // Character ID or null for narrator
  text: string | ((state: GameState) => string); // Dynamic text support

  // === CHARACTER DISPLAY ===
  characterExpression?: CharacterExpression; // Which sprite/emotion to show
  characterPosition?: CharacterPosition; // Where to show character

  // === EFFECTS ===
  textEffects?: TextEffect[]; // Shake, color, bold, etc.
  sceneEffects?: SceneEffect[]; // Screen shake, fade, etc.

  // === TIMING ===
  autoAdvanceDelay?: number; // Auto-advance after X seconds
  pauseAfter?: boolean; // Wait for player input
}

// Player choice structure
export interface Choice {
  id: string;
  text: string | ((state: GameState) => string);

  // === CONDITIONS & EFFECTS ===
  condition?: (state: GameState) => boolean; // Is choice available?
  action: (state: GameState) => void; // What happens when chosen

  // === NAVIGATION ===
  nextSceneId?: string; // Where to go after choice

  // === METADATA ===
  tags?: string[]; // For analytics, achievements, etc.
}
