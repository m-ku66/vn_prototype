import { Scene, Choice } from "../types/gameTypes";
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
    choices: [
      {
        text: "Start",
        routeEffects: {}, // Neutral choice - no route effects
      },
      {
        text: "Exit",
        routeEffects: {}, // Neutral choice - no route effects
      },
    ],
    category: "main",
  },
  {
    id: 2,
    title: "Forest",
    description: "You are in a dark forest.",
    choices: [
      {
        text: "Go North",
        routeEffects: { action: 1 }, // Bold, decisive action
      },
      {
        text: "Go South",
        routeEffects: { mystery: 1 }, // Cautious, exploring unknown
      },
      {
        text: "Do Nothing",
        routeEffects: { friendship: 1 }, // Thoughtful, patient approach
      },
    ],
    category: "main",
  },
  {
    id: 3,
    title: "Village",
    description: "You arrive at a peaceful village.",
    choices: [
      {
        text: "Talk to villagers",
        routeEffects: { friendship: 1 }, // Social, friendly interaction
      },
      {
        text: "Visit the inn",
        routeEffects: { romance: 1 }, // Could lead to romantic encounters
      },
      {
        text: "Continue traveling",
        routeEffects: { action: 1 }, // Keep moving, action-oriented
      },
    ],
    category: "main",
  },
];

const romanceScenes: QueueScene[] = [
  {
    id: 101,
    title: "Romantic Picnic",
    description: "A special romantic moment under the stars.",
    choices: [
      {
        text: "Share a kiss",
        routeEffects: { romance: 2 }, // Strong romantic choice
      },
      {
        text: "Hold hands",
        routeEffects: { romance: 1, friendship: 1 }, // Romantic but also friendship
      },
      {
        text: "Talk about the future",
        routeEffects: { romance: 1 }, // Romantic commitment
      },
    ],
    category: "romance",
  },
  {
    id: 102,
    title: "Love Confession",
    description: "The moment you've been building toward...",
    choices: [
      {
        text: "Accept",
        routeEffects: { romance: 3 }, // Very strong romantic choice
      },
      {
        text: "Need more time",
        routeEffects: { friendship: 1, mystery: 1 }, // Cautious, keeps options open
      },
      {
        text: "Just friends",
        routeEffects: { friendship: 2, romance: -1 }, // Friendship boost, romance penalty
      },
    ],
    category: "romance",
  },
];

const friendshipScenes: QueueScene[] = [
  {
    id: 201,
    title: "Campfire Stories",
    description: "Sharing tales and bonding over the fire.",
    choices: [
      {
        text: "Share a funny story",
        routeEffects: { friendship: 2 }, // Strong friendship building
      },
      {
        text: "Ask about their past",
        routeEffects: { friendship: 1, mystery: 1 }, // Friendship with intrigue
      },
      {
        text: "Suggest games",
        routeEffects: { friendship: 1, action: 1 }, // Social fun with activity
      },
    ],
    category: "friendship",
  },
];

const mysteryScenes: QueueScene[] = [
  {
    id: 301,
    title: "Strange Clues",
    description: "You discover something mysterious...",
    choices: [
      {
        text: "Investigate further",
        routeEffects: { mystery: 2 }, // Strong mystery pursuit
      },
      {
        text: "Report to authorities",
        routeEffects: { friendship: 1, action: 1 }, // Responsible, action-oriented
      },
      {
        text: "Keep it secret",
        routeEffects: { mystery: 1, romance: 1 }, // Secretive, could create intimate moments
      },
    ],
    category: "mystery",
  },
];

const actionScenes: QueueScene[] = [
  {
    id: 401,
    title: "Epic Battle",
    description: "A fierce confrontation awaits!",
    choices: [
      {
        text: "Fight bravely",
        routeEffects: { action: 2 }, // Strong action choice
      },
      {
        text: "Use strategy",
        routeEffects: { action: 1, mystery: 1 }, // Action with thoughtful approach
      },
      {
        text: "Retreat tactically",
        routeEffects: { mystery: 1, friendship: 1 }, // Cautious, protective of others
      },
    ],
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
