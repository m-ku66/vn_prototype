import { Scene, Choice, DialogueSlide } from "../types/gameTypes";
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
    characters: [],
    slides: [
      {
        text: "Welcome to your adventure! A new journey awaits, filled with mystery, friendship, romance, and action.",
      },
      {
        text: "The path ahead will be shaped by the choices you make. Every decision matters.",
        choices: [
          {
            text: "I'm ready to begin!",
            routeEffects: {}, // Neutral choice - no route effects
          },
          {
            text: "Maybe another time...",
            routeEffects: {}, // Neutral choice - no route effects
          },
        ],
      },
    ],
    category: "main",
  },
  {
    id: 2,
    title: "The Dark Forest",
    characters: [],
    slides: [
      {
        text: "You find yourself standing at the edge of a dark, ancient forest. Towering trees block out most of the moonlight, creating an maze of shadows.",
      },
      {
        text: "The air is thick with mystery. Somewhere in the distance, you hear the faint sound of... something. It could be wind, or it could be something else entirely.",
      },
      {
        text: "Three paths stretch before you, each disappearing into the darkness. Which way will you go?",
        choices: [
          {
            text: "Take the northern path boldly",
            routeEffects: { action: 1 }, // Bold, decisive action
          },
          {
            text: "Choose the southern route carefully",
            routeEffects: { mystery: 1 }, // Cautious, exploring unknown
          },
          {
            text: "Stay here and observe for a while",
            routeEffects: { friendship: 1 }, // Thoughtful, patient approach
          },
        ],
      },
    ],
    category: "main",
  },
  {
    id: 3,
    title: "The Peaceful Village",
    characters: ["Village Elder", "Innkeeper", "Mysterious Traveler"],
    slides: [
      {
        text: "After hours of walking, you emerge from the forest to find a quaint village nestled in a valley. Warm light spills from cottage windows, and the scent of freshly baked bread fills the air.",
      },
      {
        speaker: "Village Elder",
        text: "Welcome, traveler! We don't get many visitors here. You look like you've come a long way.",
      },
      {
        text: "The village elder's kind smile puts you at ease. This seems like a safe place to rest, but you notice other interesting people around as well.",
      },
      {
        text: "What would you like to do in this peaceful village?",
        choices: [
          {
            text: "Chat with the friendly villagers",
            routeEffects: { friendship: 1 }, // Social, friendly interaction
          },
          {
            text: "Visit the cozy inn for the evening",
            routeEffects: { romance: 1 }, // Could lead to romantic encounters
          },
          {
            text: "Continue your journey without delay",
            routeEffects: { action: 1 }, // Keep moving, action-oriented
          },
        ],
      },
    ],
    category: "main",
  },
];

const romanceScenes: QueueScene[] = [
  {
    id: 101,
    title: "Starlit Picnic",
    characters: ["Your Love Interest"],
    slides: [
      {
        text: "You and your companion have found a perfect spot on a hilltop overlooking the village below. A blanket is spread between you, and the night sky sparkles with countless stars.",
      },
      {
        speaker: "Your Love Interest",
        text: "I've never seen stars this beautiful before... Thank you for bringing me here.",
      },
      {
        text: "There's something magical about this moment. The gentle breeze, the starlight, and the person beside you create an atmosphere of pure romance.",
      },
      {
        speaker: "Your Love Interest",
        text: "I'm so glad we're here together...",
      },
      {
        text: "Your heart races as you feel the connection between you growing stronger. How do you respond to this intimate moment?",
        choices: [
          {
            text: "Lean in for a tender kiss",
            routeEffects: { romance: 2 }, // Strong romantic choice
          },
          {
            text: "Take their hand gently",
            routeEffects: { romance: 1, friendship: 1 }, // Romantic but also friendship
          },
          {
            text: "Share your dreams for the future together",
            routeEffects: { romance: 1 }, // Romantic commitment
          },
        ],
      },
    ],
    category: "romance",
  },
  {
    id: 102,
    title: "A Heartfelt Confession",
    characters: ["Your Love Interest"],
    slides: [
      {
        speaker: "Your Love Interest",
        text: "I... I need to tell you something important. I've been thinking about this for so long.",
      },
      {
        text: "You can see the nervousness in their eyes, but also a deep sincerity. Your heart starts beating faster.",
      },
      {
        speaker: "Your Love Interest",
        text: "I think... no, I know... I'm falling in love with you.",
      },
      {
        text: "The words hang in the air between you, heavy with meaning. This is the moment you've both been building toward.",
      },
      {
        speaker: "Your Love Interest",
        text: "I understand if you need time to think, but I had to tell you how I feel.",
      },
      {
        text: "Your response will change everything between you. What does your heart tell you to say?",
        choices: [
          {
            text: "I love you too",
            routeEffects: { romance: 3 }, // Very strong romantic choice
          },
          {
            text: "I need more time to figure out my feelings",
            routeEffects: { friendship: 1, mystery: 1 }, // Cautious, keeps options open
          },
          {
            text: "I care about you, but as a dear friend",
            routeEffects: { friendship: 2, romance: -1 }, // Friendship boost, romance penalty
          },
        ],
      },
    ],
    category: "romance",
  },
];

const friendshipScenes: QueueScene[] = [
  {
    id: 201,
    title: "Campfire Stories",
    characters: ["Your Companion"],
    slides: [
      {
        text: "The campfire crackles warmly as you and your companion settle in for the night. The flames cast dancing shadows across both your faces.",
      },
      {
        speaker: "Your Companion",
        text: "You know, I'm really glad we met. This journey wouldn't be the same without you.",
      },
      {
        text: "There's something special about sharing stories around a fire. It brings people closer together, creating bonds that last a lifetime.",
      },
      {
        speaker: "Your Companion",
        text: "Want to share some stories? I've got plenty of adventures to tell!",
      },
      {
        text: "This is a perfect opportunity to deepen your friendship. What kind of story do you want to share?",
        choices: [
          {
            text: "Tell a hilarious story from your past",
            routeEffects: { friendship: 2 }, // Strong friendship building
          },
          {
            text: "Ask about their most mysterious adventure",
            routeEffects: { friendship: 1, mystery: 1 }, // Friendship with intrigue
          },
          {
            text: "Suggest playing some fun games instead",
            routeEffects: { friendship: 1, action: 1 }, // Social fun with activity
          },
        ],
      },
    ],
    category: "friendship",
  },
];

const mysteryScenes: QueueScene[] = [
  {
    id: 301,
    title: "Strange Discoveries",
    characters: [],
    slides: [
      {
        text: "While exploring an abandoned building, you stumble upon something unusual. A collection of strange symbols carved into the wall, still fresh despite the age of the place.",
      },
      {
        text: "Your heart starts racing as you realize these aren't random scratches. They form a pattern, a message of some kind.",
      },
      {
        text: "Below the symbols, you find a small, leather-bound journal. Its pages contain cryptic notes and sketches that match the wall carvings.",
      },
      {
        text: "This discovery could be significant... or dangerous. The question is: what do you do with this mysterious knowledge?",
        choices: [
          {
            text: "Study the symbols and journal carefully",
            routeEffects: { mystery: 2 }, // Strong mystery pursuit
          },
          {
            text: "Report your findings to the local authorities",
            routeEffects: { friendship: 1, action: 1 }, // Responsible, action-oriented
          },
          {
            text: "Keep this discovery secret for now",
            routeEffects: { mystery: 1, romance: 1 }, // Secretive, could create intimate moments
          },
        ],
      },
    ],
    category: "mystery",
  },
];

const actionScenes: QueueScene[] = [
  {
    id: 401,
    title: "The Confrontation",
    characters: ["Mysterious Adversary"],
    slides: [
      {
        text: "The air grows tense as a figure steps out from the shadows, blocking your path. Their stance is aggressive, and you can see the glint of a weapon at their side.",
      },
      {
        speaker: "Mysterious Adversary",
        text: "You've interfered with my plans for the last time. This ends here and now!",
      },
      {
        text: "Your pulse quickens as you realize this confrontation was inevitable. They're not going to let you pass without a fight.",
      },
      {
        speaker: "Mysterious Adversary",
        text: "Draw your weapon, or face the consequences!",
      },
      {
        text: "The moment hangs in the balance. Your next action will determine how this dangerous encounter unfolds.",
        choices: [
          {
            text: "Face them head-on with courage",
            routeEffects: { action: 2 }, // Strong action choice
          },
          {
            text: "Use clever tactics and strategy",
            routeEffects: { action: 1, mystery: 1 }, // Action with thoughtful approach
          },
          {
            text: "Make a tactical retreat to safety",
            routeEffects: { mystery: 1, friendship: 1 }, // Cautious, protective of others
          },
        ],
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
