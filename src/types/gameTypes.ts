/**
 * Game-related type definitions
 */

export type Player = {
  name: string;
  age: number;
};

export type NPC = {
  name: string;
  role: string;
  age: number;
};

export type Scene = {
  id: number;
  title: string;
  description: string;
  choices: string[];
};