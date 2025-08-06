import { create } from "zustand";
import { scenes } from "./scenes";
import { Scene } from "src/types/gameTypes";

type SceneStore = {
  currentScene: Scene | null;
  goToSceneById: (id: number) => void;
  goToNextScene: () => void;
  resetGame: () => void;
};

export const useSceneManager = create<SceneStore>((set, get) => ({
  currentScene: scenes[0] || null,
  goToSceneById: (id: number) => {
    const scene = scenes.find((s) => s.id === id || null);
    if (scene) {
      set({ currentScene: scene });
    } else {
      console.warn(`Scene with id ${id} not found.`);
    }
  },
  goToNextScene: () => {
    const currentScene = get().currentScene;
    if (currentScene) {
      const currentIndex = scenes.findIndex((s) => s.id === currentScene.id);
      const nextScene = scenes[currentIndex + 1] || null;
      if (nextScene) {
        set({ currentScene: nextScene });
      } else {
        console.warn("No more scenes available.");
      }
    }
  },
  resetGame: () => {
    set({ currentScene: scenes[0] || null });
  },
}));
