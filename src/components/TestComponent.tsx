import { useSceneManager } from "../game_logic/sceneManager";
import { useGameState } from "../game_logic/gameState";

interface TestComponentProps {
    onGameComplete?: () => void; // Optional callback for when game ends
}

export default function TestComponent({ onGameComplete }: TestComponentProps) {
    const {
        currentScene,
        goToNextScene,
        resetScenes,
        getQueueInfo,
    } = useSceneManager();

    const {
        routePoints,
        addRoutePoints,
        incrementChoiceCount,
        getLeadingRoute,
        resetGameState,
        getPlayer, // Get player info to personalize the experience
    } = useGameState();

    // Get player info for personalization
    const playerName = getPlayer("name");
    const player = getPlayer(); // Full player object for display

    // Handle player choice selection
    const handleChoiceClick = (choiceIndex: number) => {
        if (!currentScene) return;

        // Get the selected choice object
        const selectedChoice = currentScene.choices[choiceIndex];
        if (!selectedChoice) return;

        // Apply route effects from the choice
        Object.entries(selectedChoice.routeEffects).forEach(([route, points]) => {
            addRoutePoints(route as any, points); // Apply each route effect
        });

        // Track that a choice was made
        incrementChoiceCount();

        // Simple progression - just pass the current route points
        goToNextScene(routePoints);
    };

    // Handle manual next scene (for testing)
    const handleNextScene = () => {
        goToNextScene(routePoints);
    };

    // Handle complete reset
    const handleReset = () => {
        resetScenes();
        resetGameState();
    };

    // Handle play again (calls the onGameComplete callback)
    const handlePlayAgain = () => {
        if (onGameComplete) {
            onGameComplete(); // This will trigger the app to go back to setup
        } else {
            // Fallback if no callback provided
            handleReset();
        }
    };

    // Get debug info
    const leadingRoute = getLeadingRoute();
    const queueInfo = getQueueInfo();

    // Show game complete state if no current scene
    if (!currentScene) {
        return (
            <div className="container max-w-full h-screen flex flex-col items-center justify-center bg-black text-white p-4">
                <h1 className="text-4xl font-bold mb-4">🎉 Story Complete! 🎉</h1>
                <p className="text-xl mb-6">
                    Congratulations, <strong>{playerName}</strong>! You've reached the end of this route!
                </p>
                <p className="text-lg mb-4">Final Route: <strong>{leadingRoute || 'Balanced'}</strong></p>
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-2">Your Character</h3>
                    <p><strong>Name:</strong> {player.name}</p>
                    <p><strong>Age:</strong> {player.age}</p>
                </div>
                <button
                    onClick={handlePlayAgain}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded text-lg"
                >
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="container max-w-full h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            {/* Player Info Header */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 w-full max-w-2xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Welcome, <span className="text-blue-400">{playerName}</span>!
                        </h2>
                        <p className="text-sm text-gray-400">Age {player.age}</p>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                        Leading Route: <span className="text-yellow-300">{leadingRoute || 'Balanced'}</span>
                    </div>
                </div>
            </div>

            {/* Scene Content */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold mb-2">{currentScene.title}</h1>
                <p className="text-sm text-gray-400 mb-4">
                    {currentScene.category} route • ID: {currentScene.id}
                </p>
                <p className="text-xl mb-6 max-w-2xl">
                    {/* Personalize the description by replacing "You" with player name occasionally */}
                    {currentScene.description.replace(/^You/, playerName)}
                </p>
            </div>

            {/* Route Progress Display */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold mb-2">Your Route Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-red-900 rounded p-2">
                        <div className="font-bold">Romance</div>
                        <div className="text-2xl">{routePoints.romance}</div>
                    </div>
                    <div className="bg-blue-900 rounded p-2">
                        <div className="font-bold">Friendship</div>
                        <div className="text-2xl">{routePoints.friendship}</div>
                    </div>
                    <div className="bg-purple-900 rounded p-2">
                        <div className="font-bold">Mystery</div>
                        <div className="text-2xl">{routePoints.mystery}</div>
                    </div>
                    <div className="bg-orange-900 rounded p-2">
                        <div className="font-bold">Action</div>
                        <div className="text-2xl">{routePoints.action}</div>
                    </div>
                </div>
                {leadingRoute && leadingRoute !== 'main' && (
                    <p className="text-center mt-2 text-yellow-300">
                        Leading Route: <strong>{leadingRoute.charAt(0).toUpperCase() + leadingRoute.slice(1)}</strong>
                    </p>
                )}
            </div>

            {/* Interactive Choices */}
            <div className="mb-6 w-full max-w-2xl">
                <h3 className="text-xl font-semibold mb-4 text-center">What do you do, {playerName}?</h3>
                <div className="grid gap-3">
                    {currentScene.choices.map((choice, index) => (
                        <button
                            key={index}
                            onClick={() => handleChoiceClick(index)}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-left transition-colors duration-200 border-l-4 border-blue-500"
                        >
                            <span className="text-blue-400 mr-2">👉</span>
                            {choice.text}
                        </button>
                    ))}
                </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={handleNextScene}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                    title="Skip to next scene without making a choice"
                >
                    Skip Scene
                </button>
                <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                >
                    Reset Game
                </button>
            </div>

            {/* Debug Information */}
            <details className="w-full max-w-2xl text-sm text-gray-400">
                <summary className="cursor-pointer hover:text-white">
                    Debug Info (Queue has {queueInfo.queue.length} scenes)
                </summary>
                <div className="mt-2 bg-gray-900 rounded p-3">
                    <div className="mb-2">
                        <strong>Player Info:</strong>
                        <pre className="text-xs mt-1 bg-black rounded p-2">
                            {JSON.stringify(player, null, 2)}
                        </pre>
                    </div>
                    <div className="mb-2">
                        <strong>Current Scene Queue:</strong>
                        <ul className="ml-4 mt-1">
                            {queueInfo.queue.length > 0 ? (
                                queueInfo.queue.map((scene, index) => (
                                    <li key={scene.id} className={index === 0 ? 'text-yellow-300' : ''}>
                                        {index === 0 ? '→ ' : '  '}{scene.title} ({scene.category})
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">Queue is empty - story complete!</li>
                            )}
                        </ul>
                    </div>
                    <div className="mb-2">
                        <strong>Route Points:</strong>
                        <pre className="text-xs mt-1 bg-black rounded p-2">
                            {JSON.stringify(routePoints, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <strong>Has More Scenes:</strong> {queueInfo.hasMore ? 'Yes' : 'No'}
                    </div>
                </div>
            </details>
        </div>
    );
}