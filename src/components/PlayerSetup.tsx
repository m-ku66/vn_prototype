import { useState } from "react";
import { useGameState } from "../game_logic/gameState";

interface PlayerSetupProps {
    onSetupComplete: () => void; // Callback for when setup is finished
}

export default function PlayerSetup({ onSetupComplete }: PlayerSetupProps) {
    // Local state for the name input
    const [nameInput, setNameInput] = useState("");

    // Get player management functions from game state
    const { setPlayer, getPlayer } = useGameState();

    // Get current player info (mainly for displaying age)
    const currentPlayer = getPlayer();

    // Handle form submission
    const handleStartGame = () => {
        // Validate that name isn't empty
        if (nameInput.trim() === "") {
            alert("Please enter your name before starting!");
            return;
        }

        // Save the player's name to the game state
        setPlayer("name", nameInput.trim());

        // Call the callback to let parent component know setup is complete
        onSetupComplete();
    };

    // Handle input changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(e.target.value);
    };

    // Handle enter key press in input
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleStartGame();
        }
    };

    return (
        <div className="container max-w-full h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            {/* Welcome Header */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-4 text-blue-400">
                    ✨ Welcome to Your Story ✨
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl">
                    Before we begin this adventure, let's get to know you a little better...
                </p>
            </div>

            {/* Character Setup Form */}
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md shadow-2xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                    Character Setup
                </h2>

                {/* Name Input */}
                <div className="mb-6">
                    <label
                        htmlFor="player-name"
                        className="block text-lg font-medium mb-2 text-gray-200"
                    >
                        What's your name?
                    </label>
                    <input
                        id="player-name"
                        type="text"
                        value={nameInput}
                        onChange={handleNameChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your name..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        maxLength={30}
                        autoFocus
                    />
                    <p className="text-sm text-gray-400 mt-1">
                        This is how you'll be addressed in the story
                    </p>
                </div>

                {/* Age Display */}
                <div className="mb-6">
                    <label className="block text-lg font-medium mb-2 text-gray-200">
                        Age
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white">
                        {currentPlayer.age} years old
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        Default age for this adventure
                    </p>
                </div>

                {/* Preview */}
                {nameInput.trim() && (
                    <div className="mb-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-blue-300">Preview</h3>
                        <p className="text-gray-200">
                            <strong>Name:</strong> {nameInput.trim()}
                        </p>
                        <p className="text-gray-200">
                            <strong>Age:</strong> {currentPlayer.age}
                        </p>
                    </div>
                )}

                {/* Start Button */}
                <button
                    onClick={handleStartGame}
                    disabled={nameInput.trim() === ""}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${nameInput.trim() === ""
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
                        }`}
                >
                    {nameInput.trim() === "" ? "Enter your name to continue" : "Start Your Adventure! 🚀"}
                </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-400 text-sm">
                <p>Your choices will shape your unique story experience</p>
            </div>
        </div>
    );
}