import { Scene } from "src/types/gameTypes";
import { RouteType } from "./gameState";

// Simple scene interface - no complex prerequisites needed
export interface QueueScene extends Scene {
  category: RouteType;
}

// Route-specific scene collections (these are the "source" scenes)
const mainStoryScenes: QueueScene[] = [
  {
    id: 1,
    title: "Introduction",
    description: "Welcome to the game!",
    choices: ["Start", "Exit"],
    category: "main",
  },
  {
    id: 2,
    title: "Forest",
    description: "You are in a dark forest.",
    choices: ["Go North", "Go South", "Do Nothing"],
    category: "main",
  },
  {
    id: 3,
    title: "Village",
    description: "You arrive at a peaceful village.",
    choices: ["Talk to villagers", "Visit the inn", "Continue traveling"],
    category: "main",
  },
];

const romanceScenes: QueueScene[] = [
  {
    id: 101,
    title: "Romantic Picnic",
    description: "A special romantic moment under the stars.",
    choices: ["Share a kiss", "Hold hands", "Talk about the future"],
    category: "romance",
  },
  {
    id: 102,
    title: "Love Confession",
    description: "The moment you've been building toward...",
    choices: ["Accept", "Need more time", "Just friends"],
    category: "romance",
  },
];

const friendshipScenes: QueueScene[] = [
  {
    id: 201,
    title: "Campfire Stories",
    description: "Sharing tales and bonding over the fire.",
    choices: ["Share a funny story", "Ask about their past", "Suggest games"],
    category: "friendship",
  },
];

const mysteryScenes: QueueScene[] = [
  {
    id: 301,
    title: "Strange Clues",
    description: "You discover something mysterious...",
    choices: ["Investigate further", "Report to authorities", "Keep it secret"],
    category: "mystery",
  },
];

const actionScenes: QueueScene[] = [
  {
    id: 401,
    title: "Epic Battle",
    description: "A fierce confrontation awaits!",
    choices: ["Fight bravely", "Use strategy", "Retreat tactically"],
    category: "action",
  },
];

// Scene collections organized by route
const sceneCollections: Record<RouteType, QueueScene[]> = {
  main: mainStoryScenes,
  romance: romanceScenes,
  friendship: friendshipScenes,
  mystery: mysteryScenes,
  action: actionScenes,
};

// Scene queue manager class
export class SceneQueueManager {
  // The main scene queue - this gets populated dynamically
  private sceneQueue: QueueScene[] = [];

  // Track progress through each route collection
  private routeProgress: Record<RouteType, number> = {
    main: 0,
    romance: 0,
    friendship: 0,
    mystery: 0,
    action: 0,
  };

  // Initialize with the first main story scene
  constructor() {
    this.addNextMainScene();
  }

  // Get the current scene (front of the queue)
  getCurrentScene(): QueueScene | null {
    return this.sceneQueue[0] || null;
  }

  // Move to the next scene in the queue
  advanceScene(): void {
    if (this.sceneQueue.length > 0) {
      this.sceneQueue.shift(); // Remove the current scene
    }
  }

  // Add the next scene from a specific route collection to the queue
  private addSceneFromRoute(route: RouteType): boolean {
    const collection = sceneCollections[route];
    const currentProgress = this.routeProgress[route];

    if (currentProgress < collection.length) {
      const nextScene = collection[currentProgress];
      this.sceneQueue.push(nextScene);
      this.routeProgress[route]++;
      console.log(`Added ${route} scene: ${nextScene.title}`);
      return true;
    }

    return false; // No more scenes in this route
  }

  // Add the next main story scene (always try this first)
  private addNextMainScene(): boolean {
    return this.addSceneFromRoute("main");
  }

  // Populate the queue based on player's route points
  populateQueueBasedOnChoices(routePoints: Record<RouteType, number>): void {
    // Determine which route has the most points (excluding main)
    const nonMainRoutes: RouteType[] = [
      "romance",
      "friendship",
      "mystery",
      "action",
    ];
    let leadingRoute: RouteType | null = null;
    let highestPoints = 0;

    nonMainRoutes.forEach((route) => {
      if (routePoints[route] > highestPoints) {
        highestPoints = routePoints[route];
        leadingRoute = route;
      }
    });

    // Add scenes based on route preference
    if (leadingRoute && highestPoints > 0) {
      // Player is leaning toward a specific route
      if (Math.random() < 0.7) {
        // 70% chance for route-specific scene
        if (!this.addSceneFromRoute(leadingRoute)) {
          // If no more scenes in preferred route, add main scene
          this.addNextMainScene();
        }
      } else {
        // 30% chance for main story continuation
        if (!this.addNextMainScene()) {
          // If no more main scenes, add from preferred route
          this.addSceneFromRoute(leadingRoute);
        }
      }
    } else {
      // Player hasn't chosen a route yet, continue with main story
      if (!this.addNextMainScene()) {
        // If main story is done, add from any available route
        for (const route of nonMainRoutes) {
          if (this.addSceneFromRoute(route)) break;
        }
      }
    }

    console.log("Queue updated. Current queue length:", this.sceneQueue.length);
    console.log(
      "Next scenes:",
      this.sceneQueue.map((s) => s.title)
    );
  }

  // Get all scenes in the current queue (for debugging)
  getQueue(): QueueScene[] {
    return [...this.sceneQueue];
  }

  // Reset the queue manager
  reset(): void {
    this.sceneQueue = [];
    this.routeProgress = {
      main: 0,
      romance: 0,
      friendship: 0,
      mystery: 0,
      action: 0,
    };
    this.addNextMainScene(); // Start with first main scene again
  }

  // Check if there are more scenes available
  hasMoreScenes(): boolean {
    return this.sceneQueue.length > 0;
  }
}

// Export singleton instance
export const sceneQueue = new SceneQueueManager();
