"use client";
import { useState, useEffect } from "react";

export default function NullOtoHome() {
  const [noiseLevel, setNoiseLevel] = useState(57);
  const [realizedEnvironment, setRealizedEnvironment] = useState(36);
  const [cancellationEffect, setCancellationEffect] = useState(-21);
  const [isActive, setIsActive] = useState(false);
  const [currentPreset, setCurrentPreset] = useState("洗濯機の音");
  const [waveformData, setWaveformData] = useState<number[] | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    setWaveformData(
      Array(20)
        .fill(0)
        .map(() => Math.random() * 100)
    );

    const interval = setInterval(() => {
      setNoiseLevel((prev) => prev + (Math.random() - 0.5) * 2);
      setRealizedEnvironment((prev) => prev + (Math.random() - 0.5) * 1);
      setCancellationEffect((prev) => prev + (Math.random() - 0.5) * 0.5);
      setWaveformData(
        Array(20)
          .fill(0)
          .map(() => Math.random() * 100)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      className="bg-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: "440px", height: "956px" }}
    >
      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Menu Icon */}
        <div className="flex justify-start mb-4">
          <button className="p-2">
            <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600"></div>
          </button>
        </div>

        {/* Noise Level Display */}
        <div className="flex justify-between mb-8">
          <div className="text-center flex-col">
            <h2 className="text-black text-sm mb-1">騒音レベル</h2>
            <p className="text-3xl font-bold text-black">
              {noiseLevel.toFixed(0)} dB
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-black text-sm mb-1">実現環境</h2>
            <p className="text-3xl font-bold text-black">
              {realizedEnvironment.toFixed(0)} dB
            </p>
          </div>
        </div>

        {/* Circular Visualization */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer ring with progress */}
            <div className="w-48 h-48 rounded-full border-8 border-gray-200 relative">
              <div
                className="absolute inset-0 rounded-full border-8 border-red-500"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${
                    50 + 25 * Math.cos(Math.PI * 2 * 0.7)
                  }% ${50 + 25 * Math.sin(Math.PI * 2 * 0.7)}%, 50% 50%)`,
                }}
              ></div>
              {/* Inner circle */}
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-black">
                  {cancellationEffect.toFixed(1)} dB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="flex justify-center items-end h-16 mb-8 space-x-1">
          {waveformData &&
            waveformData.map((height, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-sm"
                style={{
                  width: "8px",
                  height: `${height * 0.6}px`,
                  minHeight: "4px",
                }}
              ></div>
            ))}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between items-center mb-4">
          <button className="w-12 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-4 h-0.5 bg-black mb-0.5"></div>
            <div className="w-4 h-0.5 bg-black mb-0.5"></div>
            <div className="w-4 h-0.5 bg-black"></div>
          </button>

          <button
            onClick={handleStartStop}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isActive ? "bg-red-500" : "bg-gray-400"
            }`}
          >
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </button>

          <button className="w-12 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-600 rounded-full"></div>
          </button>
        </div>

        {/* Preset Display */}
        <div className="text-center">
          <p className="text-red-500 text-sm">Preset: {currentPreset}</p>
        </div>

        {/* Audio Wave GIF */}
        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center mt-4">
          <img
            src="/assets/audio_wave.gif"
            alt="Audio Wave"
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
