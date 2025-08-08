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

// Updated scene type to use Choice objects instead of strings
export type Scene = {
  id: number;
  title: string;
  description: string;
  choices: Choice[]; // Now uses Choice objects instead of string[]
};
