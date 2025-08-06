import { useSceneManager } from "../game_logic/sceneManager";

export default function TestComponent() {
    const {
        currentScene,
        goToNextScene,
        resetGame,
    } = useSceneManager();

    return (
        <div className="container max-w-full h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <h1 className="text-4xl font-bold mb-4">{currentScene.title}</h1>
            <p className="text-xl mb-6">{currentScene.description}</p>

            <ul className="mb-6">
                {currentScene.choices.map((choice, index) => (
                    <li key={index} className="text-lg">👉 {choice}</li>
                ))}
            </ul>

            <div className="flex gap-4">
                <button
                    onClick={goToNextScene}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                    Next Scene
                </button>
                <button
                    onClick={resetGame}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                    Reset Game
                </button>
            </div>
        </div>
    );
}
