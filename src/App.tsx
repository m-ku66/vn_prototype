import ReactDOM from "react-dom/client";
import { useGameState } from "./game_logic/gameState";
import PlayerSetup from "./components/PlayerSetup";
import TestComponent from "./components/TestComponent";

// Props interface for TestComponent (we'll need to update TestComponent to accept this)
interface TestComponentProps {
    onGameComplete?: () => void;
}

function App() {
    // Get current app phase and phase management functions
    const { currentPhase, setAppPhase } = useGameState();

    // Handle when player setup is complete
    const handleSetupComplete = () => {
        console.log("Player setup completed! Transitioning to game...");
        setAppPhase("playing");
    };

    // Handle when game is complete and player wants to restart
    const handleGameRestart = () => {
        console.log("Restarting game...");
        setAppPhase("setup");
    };

    // Render different components based on current app phase
    const renderCurrentPhase = () => {
        switch (currentPhase) {
            case "setup":
                return <PlayerSetup onSetupComplete={handleSetupComplete} />;

            case "playing":
                return <TestComponent onGameComplete={handleGameRestart} />;

            case "paused":
                // TODO: Implement pause screen later
                return (
                    <div className="container max-w-full h-screen flex items-center justify-center bg-black text-white">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Game Paused</h1>
                            <button
                                onClick={() => setAppPhase("playing")}
                                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded text-lg"
                            >
                                Resume Game
                            </button>
                        </div>
                    </div>
                );

            case "menu":
                // TODO: Implement main menu later
                return (
                    <div className="container max-w-full h-screen flex items-center justify-center bg-black text-white">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Main Menu</h1>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setAppPhase("playing")}
                                    className="block bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded text-lg"
                                >
                                    Continue Game
                                </button>
                                <button
                                    onClick={handleGameRestart}
                                    className="block bg-green-500 hover:bg-green-600 px-6 py-3 rounded text-lg"
                                >
                                    New Game
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case "complete":
                // TODO: Implement game complete screen later
                return (
                    <div className="container max-w-full h-screen flex items-center justify-center bg-black text-white">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">🎉 Adventure Complete! 🎉</h1>
                            <p className="text-xl mb-6">Thank you for playing!</p>
                            <button
                                onClick={handleGameRestart}
                                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded text-lg"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                );

            default:
                // Fallback to setup if unknown phase
                console.warn(`Unknown app phase: ${currentPhase}, defaulting to setup`);
                setAppPhase("setup");
                return <PlayerSetup onSetupComplete={handleSetupComplete} />;
        }
    };

    return <div className="app">{renderCurrentPhase()}</div>;
}

// Create the root and render the App component
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);