// Character definition
export interface Character {
  id: string;
  name: string;
  displayName?: string; // Name shown in dialogue (might change)

  // === SPRITES ===
  sprites: Record<string, string>; // emotion -> image path
  defaultExpression: string; // fallback expression

  // === AUDIO ===
  voiceActor?: string;
  textSound?: string; // Typing sound for this character

  // === METADATA ===
  description?: string;
  age?: number;
  tags?: string[]; // For filtering, relationships, etc.
}

// Character positioning on screen
export interface CharacterPosition {
  characterId: string;
  position: "left" | "center" | "right" | "far-left" | "far-right";
  expression: string;
  scale?: number; // Size multiplier
  opacity?: number; // For fade effects
  zIndex?: number; // Layering
}

export interface CharacterExpression {
  id: string; // Character ID
  expression:
    | "neutral"
    | "happy"
    | "sad"
    | "angry"
    | "surprised"
    | "confused"
    | "deadpan"; // Emotion or state (happy, sad, etc.)
}
