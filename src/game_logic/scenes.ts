import { Scene } from "src/types/gameTypes";

const scenes: Scene[] = [
  {
    id: 1,
    title: "Introduction",
    description: "Welcome to the game!",
    choices: ["Start", "Exit"],
  },
  {
    id: 2,
    title: "Forest",
    description: "You are in a dark forest.",
    choices: ["Go North", "Go South", "Do Nothing"],
  },
];

export { scenes };
