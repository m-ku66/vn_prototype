import { create } from "zustand";
import { Player } from "../types/gameTypes";
import { useSceneManager } from "./sceneManager";

// Define the different routes that players can accumulate points toward
export type RouteType =
  | "main"
  | "romance"
  | "friendship"
  | "mystery"
  | "action";

// App phase management for controlling overall game flow
export type AppPhase = "setup" | "playing" | "paused" | "menu" | "complete";

// Player attribute keys for type safety
export type PlayerAttribute = keyof Player;

// Game state interface for type safety
type GameState = {
  // App phase management
  currentPhase: AppPhase;

  // Player information
  player: Player;

  // Points toward different story routes
  // Each route type has a numerical value that increases based on player choices
  routePoints: Record<RouteType, number>;

  // Track total choices made (useful for analytics or achievements later)
  totalChoicesMade: number;

  // App phase management actions
  setAppPhase: (phase: AppPhase) => void;
  getAppPhase: () => AppPhase;

  // Player management actions
  setPlayer: <K extends PlayerAttribute>(
    attribute: K,
    value: Player[K]
  ) => void;

  // Overloaded getPlayer function
  getPlayer(): Player;
  getPlayer<K extends PlayerAttribute>(attribute: K): Player[K];
  getPlayer<K extends PlayerAttribute>(attribute?: K): Player | Player[K];

  // Actions for managing the game state
  addRoutePoints: (route: RouteType, points: number) => void;
  getRoutePoints: (route: RouteType) => number;
  getLeadingRoute: () => RouteType | null;
  incrementChoiceCount: () => void;
  resetGameState: () => void;

  // Utility function to check if a route has reached a threshold
  hasRouteThreshold: (route: RouteType, threshold: number) => boolean;

  // Helper to get current scene from scene manager (read-only access)
  getCurrentScene: () => ReturnType<
    typeof useSceneManager.getState
  >["currentScene"];
};

// Initial state values
const initialRoutePoints: Record<RouteType, number> = {
  main: 0,
  romance: 0,
  friendship: 0,
  mystery: 0,
  action: 0,
};

// Initial player state - we'll set a default age and empty name
const initialPlayer: Player = {
  name: "",
  age: 18, // Default age as you mentioned
};

// Create the game state store using Zustand
export const useGameState = create<GameState>((set, get) => ({
  // Initial values
  currentPhase: "setup", // Start with player setup
  player: { ...initialPlayer },
  routePoints: { ...initialRoutePoints },
  totalChoicesMade: 0,

  // App phase management
  setAppPhase: (phase: AppPhase) => {
    set({ currentPhase: phase });
  },

  getAppPhase: () => {
    return get().currentPhase;
  },

  // Set a specific player attribute
  setPlayer: <K extends PlayerAttribute>(attribute: K, value: Player[K]) => {
    set((state) => ({
      player: {
        ...state.player,
        [attribute]: value,
      },
    }));
  },

  // Get player info - overloaded to return full object or specific attribute
  getPlayer: <K extends PlayerAttribute>(attribute?: K) => {
    const { player } = get();

    // If no attribute specified, return the full player object
    if (attribute === undefined) {
      return player;
    }

    // Otherwise return the specific attribute
    return player[attribute];
  },

  // Add points to a specific route based on player choices
  addRoutePoints: (route: RouteType, points: number) => {
    set((state) => ({
      routePoints: {
        ...state.routePoints,
        [route]: state.routePoints[route] + points,
      },
    }));
  },

  // Get the current points for a specific route
  getRoutePoints: (route: RouteType) => {
    return get().routePoints[route];
  },

  // Determine which route currently has the most points
  getLeadingRoute: () => {
    const { routePoints } = get();
    let leadingRoute: RouteType | null = null;
    let highestPoints = 0;

    // Loop through all routes to find the one with the most points
    (Object.keys(routePoints) as RouteType[]).forEach((route) => {
      if (routePoints[route] > highestPoints) {
        highestPoints = routePoints[route];
        leadingRoute = route;
      }
    });

    return leadingRoute;
  },

  // Increment the total choice counter
  incrementChoiceCount: () => {
    set((state) => ({
      totalChoicesMade: state.totalChoicesMade + 1,
    }));
  },

  // Check if a route has reached a specific point threshold
  hasRouteThreshold: (route: RouteType, threshold: number) => {
    return get().routePoints[route] >= threshold;
  },

  // Helper to access current scene from scene manager (read-only)
  getCurrentScene: () => {
    return useSceneManager.getState().currentScene;
  },

  // Reset game state completely (including player info and app phase)
  resetGameState: () => {
    set({
      currentPhase: "setup", // Reset back to setup phase
      player: { ...initialPlayer },
      routePoints: { ...initialRoutePoints },
      totalChoicesMade: 0,
    });
  },
}));
