"use client";
import { useState, useEffect } from "react";

export default function NullOtoPreset() {
  const [activePresetIndex, setActivePresetIndex] = useState(1);
  const [presets, setPresets] = useState([
    {
      name: "洗濯機の音",
      creationDate: "2025/8/8 10:22",
      updateDate: "2025/8/20 11:14",
      memo: "洗濯機を動かしている時間",
      usageTime: "2h 11m",
      averageEffect: -17.3,
      waveformData: Array(30)
        .fill(0)
        .map(() => Math.random() * 100),
    },
    {
      name: "オフィス環境",
      creationDate: "2025/8/5 14:30",
      updateDate: "2025/8/18 09:15",
      memo: "オフィスでの作業時間",
      usageTime: "1m",
      averageEffect: -12.5,
      waveformData: Array(30)
        .fill(0)
        .map(() => Math.random() * 80),
    },
    {
      name: "電車内",
      creationDate: "2025/8/10 08:45",
      updateDate: "2025/8/19 16:20",
      memo: "通勤時の電車内",
      usageTime: "45m",
      averageEffect: -8.2,
      waveformData: Array(30)
        .fill(0)
        .map(() => Math.random() * 60),
    },
  ]);

  const activePreset = presets[activePresetIndex];

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
        <h1 className="text-red-500 text-lg font-medium">
          active: {activePreset.name}
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Success Checkmark */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white border-2 border-red-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✓</span>
            </div>
          </div>
        </div>

        {/* Preset Carousel */}
        <div className="relative mb-6">
          <div className="flex space-x-4 overflow-hidden">
            {/* Left Card (Partially Visible) */}
            <div className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 p-4 transform -translate-x-8">
              <div className="h-20 bg-gray-100 rounded mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 20">
                  <path
                    d="M 0 10 L 10 8 L 20 12 L 30 6 L 40 14 L 50 4 L 60 16 L 70 2 L 80 18 L 90 0 L 100 20"
                    stroke="red"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-500">
                <p>1m</p>
                <p>dB</p>
              </div>
            </div>

            {/* Center Card (Active) */}
            <div className="flex-shrink-0 w-80 bg-white rounded-lg border-2 border-red-500 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-red-500 font-medium">
                  {activePreset.name}
                </h2>
                <button className="w-4 h-4 text-gray-400">✎</button>
              </div>

              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>作成日時:</span>
                  <span>{activePreset.creationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>更新日時:</span>
                  <span>{activePreset.updateDate}</span>
                </div>
              </div>

              {/* Waveform Graph */}
              <div className="h-20 bg-gray-100 rounded mb-3">
                <svg className="w-full h-full" viewBox="0 0 100 20">
                  <path
                    d={`M ${activePreset.waveformData
                      .map(
                        (value, i) =>
                          `${
                            (i / (activePreset.waveformData.length - 1)) * 100
                          } ${20 - (value / 100) * 20}`
                      )
                      .join(" L ")}`}
                    stroke="red"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Memo */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">メモ</span>
                  <button className="w-3 h-3 text-gray-400">✎</button>
                </div>
                <p className="text-xs text-gray-800">{activePreset.memo}</p>
              </div>

              {/* Usage Stats */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">使用時間</span>
                  <span className="text-lg font-bold text-red-500">
                    {activePreset.usageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">平均効果量</span>
                  <span className="text-lg font-bold text-red-500">
                    {activePreset.averageEffect}dB
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card (Partially Visible) */}
            <div className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 p-4 transform translate-x-8">
              <div className="h-20 bg-gray-100 rounded mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 20">
                  <path
                    d="M 0 15 L 10 12 L 20 18 L 30 8 L 40 16 L 50 6 L 60 14 L 70 4 L 80 12 L 90 2 L 100 10"
                    stroke="red"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-500">
                <p>メモ</p>
                <p>平均効</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-2">
          {presets.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activePresetIndex ? "bg-red-500 w-3" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
