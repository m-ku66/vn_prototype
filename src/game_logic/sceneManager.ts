import { create } from "zustand";
import { sceneQueue, QueueScene } from "./scenes";
import { RouteType } from "./gameState";

type SceneStore = {
  currentScene: QueueScene | null;

  // Simple scene progression
  goToNextScene: (routePoints: Record<RouteType, number>) => void;

  // Get current scene from queue
  getCurrentScene: () => QueueScene | null;

  // Reset everything
  resetScenes: () => void;

  // Debug: get the current queue state
  getQueueInfo: () => {
    queue: QueueScene[];
    hasMore: boolean;
  };
};

export const useSceneManager = create<SceneStore>((set, get) => ({
  // Initialize with the first scene from the queue
  currentScene: sceneQueue.getCurrentScene(),

  // Simple scene progression based on player choices
  goToNextScene: (routePoints: Record<RouteType, number>) => {
    console.log("Advancing scene with route points:", routePoints);

    // First, populate the queue based on current route points
    sceneQueue.populateQueueBasedOnChoices(routePoints);

    // Then advance to the next scene in the queue
    sceneQueue.advanceScene();

    // Update our current scene state
    const nextScene = sceneQueue.getCurrentScene();
    set({ currentScene: nextScene });

    if (nextScene) {
      console.log(
        `Advanced to: ${nextScene.title} (${nextScene.category} route)`
      );
    } else {
      console.log("No more scenes available - game complete!");
    }
  },

  // Get the current scene (simple wrapper)
  getCurrentScene: () => {
    return get().currentScene;
  },

  // Reset the scene system
  resetScenes: () => {
    sceneQueue.reset();
    set({ currentScene: sceneQueue.getCurrentScene() });
    console.log("Scene system reset");
  },

  // Debug function to see the queue state
  getQueueInfo: () => {
    return {
      queue: sceneQueue.getQueue(),
      hasMore: sceneQueue.hasMoreScenes(),
    };
  },
}));
