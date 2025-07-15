"use client";
import { useState, useEffect } from "react";

export default function NullOtoEQ() {
  const [pointCustomData, setPointCustomData] = useState([
    { x: 0, y: 0.8 },
    { x: 0.25, y: 0.6 },
    { x: 0.5, y: 0.9 },
    { x: 0.75, y: 0.4 },
    { x: 1, y: 0.2 },
  ]);
  const [dialValues, setDialValues] = useState({
    freq: 0.5,
    q: 0.25,
    gain: 0.75,
  });
  const [bendCustomData, setBendCustomData] = useState([
    0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.2, 0.1, 0.05,
  ]);

  const handleDialChange = (dial: string, value: number) => {
    setDialValues((prev) => ({ ...prev, [dial]: value }));
  };

  const handleBendSliderChange = (index: number, value: number) => {
    setBendCustomData((prev) => {
      const newData = [...prev];
      newData[index] = value;
      return newData;
    });
  };

  return (
    <div
      className="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: "440px", height: "956px" }}
    >
      {/* Navigation Bar */}
      <div className="flex items-center px-6 py-3 border-b border-gray-200">
        <button className="flex items-center text-red-500 mr-4">
          <span className="text-lg mr-1">‹</span>
          <span className="text-sm">戻る</span>
        </button>
        <h1 className="text-red-500 text-lg font-medium">洗濯機の音</h1>
      </div>

      {/* Main Content */}
      <div
        className="px-6 py-4 overflow-y-auto"
        style={{ height: "calc(956px - 120px)" }}
      >
        {/* Point Custom Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-black-700 text-sm font-medium mb-4">
            Point Custom
          </h2>

          {/* Graph Container */}
          <div className="relative h-32 bg-white rounded border border-gray-200 mb-4">
            {/* Background waveform */}
            <div className="absolute inset-0 flex items-end px-2">
              {Array(20)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gray-100 mx-0.5"
                    style={{ height: `${Math.random() * 60 + 10}%` }}
                  ></div>
                ))}
            </div>

            {/* Red curve with points */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <path
                d={`M ${pointCustomData
                  .map((point, i) => `${point.x * 100} ${100 - point.y * 100}`)
                  .join(" L ")}`}
                stroke="red"
                strokeWidth="2"
                fill="none"
              />
              {pointCustomData.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x * 100}
                  cy={100 - point.y * 100}
                  r={i === 0 ? "3" : "2"}
                  fill="red"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Circular Dials Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between">
            {/* Frequency Dial */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 relative">
                  <div
                    className="absolute inset-0 rounded-full bg-red-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${
                        50 + 25 * Math.cos(Math.PI * 2 * dialValues.freq)
                      }% ${
                        50 + 25 * Math.sin(Math.PI * 2 * dialValues.freq)
                      }%, 50% 50%)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
              </div>
              <span className="text-xs text-gray-600">freq</span>
            </div>

            {/* Q Dial */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 relative">
                  <div
                    className="absolute inset-0 rounded-full bg-red-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${
                        50 + 25 * Math.cos(Math.PI * 2 * dialValues.q)
                      }% ${
                        50 + 25 * Math.sin(Math.PI * 2 * dialValues.q)
                      }%, 50% 50%)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
              </div>
              <span className="text-xs text-gray-600">Q</span>
            </div>

            {/* Gain Dial */}
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 relative">
                  <div
                    className="absolute inset-0 rounded-full bg-red-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${
                        50 + 25 * Math.cos(Math.PI * 2 * dialValues.gain)
                      }% ${
                        50 + 25 * Math.sin(Math.PI * 2 * dialValues.gain)
                      }%, 50% 50%)`,
                    }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
              </div>
              <span className="text-xs text-gray-600">Gain</span>
            </div>
          </div>
        </div>

        {/* Bend Custom Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-gray-700 text-sm font-medium mb-4">
            Bend Custom
          </h2>

          {/* Equalizer Sliders */}
          <div className="flex justify-between items-end h-24">
            {bendCustomData.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-4 h-20 bg-gray-200 rounded-full mb-2">
                  <div
                    className="absolute bottom-0 w-4 bg-red-500 rounded-full"
                    style={{ height: `${value * 100}%` }}
                  ></div>
                  <div
                    className="absolute w-3 h-3 bg-red-500 rounded-full"
                    style={{
                      bottom: `${value * 100}%`,
                      transform: "translateY(50%)",
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
