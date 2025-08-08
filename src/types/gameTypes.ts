/**
 * Game-related type definitions
 */

import { RouteType } from "../game_logic/gameState";

export type Player = {
  name: string;
  age: number;
};

export type NPC = {
  name: string;
  role: string;
  age: number;
};

// New choice type that includes both display text and route effects
export type Choice = {
  text: string; // The text displayed to the player
  routeEffects: Partial<Record<RouteType, number>>; // Which routes get affected and by how much
};

// Individual dialogue slide/beat within a scene
export type DialogueSlide = {
  speaker?: string; // Character name, or undefined for narration
  text: string; // The dialogue or narration text
  choices?: Choice[]; // Optional choices - only present on slides that end with player decisions
};

// Updated scene type to support dialogue sequences
export type Scene = {
  id: number;
  title: string;
  characters: string[]; // List of characters present in this scene (for UI/context)
  slides: DialogueSlide[]; // Array of dialogue parts that play in sequence
};
