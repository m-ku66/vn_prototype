import { create } from "zustand";
import { useSceneManager } from "./sceneManager";

// Define the different routes that players can accumulate points toward
export type RouteType =
  | "main"
  | "romance"
  | "friendship"
  | "mystery"
  | "action";

// Game state interface for type safety
type GameState = {
  // Points toward different story routes
  // Each route type has a numerical value that increases based on player choices
  routePoints: Record<RouteType, number>;

  // Track total choices made (useful for analytics or achievements later)
  totalChoicesMade: number;

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

// Create the game state store using Zustand
export const useGameState = create<GameState>((set, get) => ({
  // Initial values
  routePoints: { ...initialRoutePoints },
  totalChoicesMade: 0,

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

  // Reset game state (but leave scene navigation to scene manager)
  resetGameState: () => {
    set({
      routePoints: { ...initialRoutePoints },
      totalChoicesMade: 0,
    });
  },
}));
