import { Choice, DialogueLine, Scene } from "./sceneTypes";

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private gameStore: any; // Reference to Zustand store

  // === INITIALIZATION ===
  constructor(gameStore: any) {
    this.gameStore = gameStore;
  }

  loadStory(scenes: Scene[]) {
    scenes.forEach((scene) => this.scenes.set(scene.id, scene));
  }

  // === SCENE ACCESS ===
  getCurrentScene(): Scene | null {
    const { currentSceneId } = this.gameStore.getState();
    return this.scenes.get(currentSceneId) || null;
  }

  getCurrentDialogue(): DialogueLine | null {
    const scene = this.getCurrentScene();
    const { currentDialogueIndex } = this.gameStore.getState();
    return scene?.dialogue[currentDialogueIndex] || null;
  }

  getAvailableChoices(): Choice[] {
    const scene = this.getCurrentScene();
    const state = this.gameStore.getState();

    return (
      scene?.choices?.filter(
        (choice) => !choice.condition || choice.condition(state)
      ) || []
    );
  }

  // === DIALOGUE PROGRESSION ===
  canAdvanceDialogue(): boolean {
    const scene = this.getCurrentScene();
    const { currentDialogueIndex } = this.gameStore.getState();
    return scene ? currentDialogueIndex < scene.dialogue.length - 1 : false;
  }

  advanceDialogue() {
    const { currentDialogueIndex, currentSceneId } = this.gameStore.getState();
    const currentScene = this.scenes.get(currentSceneId);

    if (!currentScene) return;

    // Check if we can advance dialogue
    if (currentDialogueIndex < currentScene.dialogue.length - 1) {
      // Move to next dialogue line
      this.gameStore.setState((state: any) => ({
        ...state,
        currentDialogueIndex: currentDialogueIndex + 1,
      }));
    } else {
      // End of dialogue - handle scene completion
      this.handleSceneEnd();
    }
  }

  // === SCENE PROGRESSION ===
  gotoScene(sceneId: string) {
    const targetScene = this.scenes.get(sceneId);
    if (!targetScene) {
      console.error(`Scene ${sceneId} not found!`);
      return;
    }

    // Check if player can access this scene
    const state = this.gameStore.getState();
    if (targetScene.unlockCondition && !targetScene.unlockCondition(state)) {
      console.warn(`Scene ${sceneId} is locked!`);
      return;
    }

    // Run exit logic for current scene
    const currentScene = this.getCurrentScene();
    if (currentScene?.onExit) {
      currentScene.onExit(state);
    }

    // Update game state to new scene
    this.gameStore.setState((prevState: any) => ({
      ...prevState,
      currentSceneId: sceneId,
      currentDialogueIndex: 0,
      sceneHistory: [...prevState.sceneHistory, sceneId],
    }));

    // Run enter logic for new scene
    if (targetScene.onEnter) {
      targetScene.onEnter(this.gameStore.getState());
    }
  }

  // === CHOICE HANDLING ===
  makeChoice(choiceId: string) {
    const availableChoices = this.getAvailableChoices();
    const choice = availableChoices.find((c) => c.id === choiceId);

    if (!choice) {
      console.error(`Choice ${choiceId} not available!`);
      return;
    }

    // Execute the choice's action (modify game state)
    choice.action(this.gameStore.getState());

    // Navigate to next scene if specified
    if (choice.nextSceneId) {
      this.gotoScene(choice.nextSceneId);
    }
  }

  // === BACKWARDS NAVIGATION ===
  goBack() {
    const { sceneHistory, currentDialogueIndex } = this.gameStore.getState();

    // First try to go back in dialogue
    if (currentDialogueIndex > 0) {
      this.gameStore.setState((state: any) => ({
        ...state,
        currentDialogueIndex: currentDialogueIndex - 1,
      }));
      return;
    }

    // Then try to go back to previous scene
    if (sceneHistory.length > 1) {
      const previousSceneId = sceneHistory[sceneHistory.length - 2];
      const newHistory = sceneHistory.slice(0, -1);

      this.gameStore.setState((state: any) => ({
        ...state,
        currentSceneId: previousSceneId,
        currentDialogueIndex: 0,
        sceneHistory: newHistory,
      }));
    }
  }

  // === UTILITY METHODS ===
  jumpToScene(sceneId: string, addToHistory: boolean = true) {
    if (addToHistory) {
      this.gotoScene(sceneId);
    } else {
      // Direct jump without history tracking
      this.gameStore.setState((state: any) => ({
        ...state,
        currentSceneId: sceneId,
        currentDialogueIndex: 0,
      }));
    }
  }

  isSceneUnlocked(sceneId: string): boolean {
    const scene = this.scenes.get(sceneId);
    if (!scene) return false;

    const state = this.gameStore.getState();
    return !scene.unlockCondition || scene.unlockCondition(state);
  }

  // === PRIVATE HELPERS ===
  private handleSceneEnd() {
    const scene = this.getCurrentScene();
    if (!scene) return;

    // Check for auto-advance
    if (scene.autoAdvance && scene.choices?.length === 1) {
      // Auto-select the only choice
      this.makeChoice(scene.choices[0].id);
    }
    // Otherwise, wait for player to make a choice
  }
}
