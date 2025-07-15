# Null-Oto React Native Interface Documentation

## 目次

1. [概要](#概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [データ型](#データ型)
4. [メインクラス](#メインクラス)
5. [初期化・設定](#初期化設定)
6. [音声処理](#音声処理)
7. [プリセット管理](#プリセット管理)
8. [学習機能](#学習機能)
9. [システム管理](#システム管理)
10. [エラー処理](#エラー処理)
11. [イベント監視](#イベント監視)
12. [実装ガイドライン](#実装ガイドライン)

---

## 概要

本ドキュメントでは、Null-Oto の React Native 側インタフェースについて詳述します。JSI（JavaScript Interface）を通じて C++ネイティブエンジンとの通信を行い、ユーザーインタフェースとのブリッジ役を担います。

### 主要機能

- **非同期 API**: Promise/async-await パターン
- **リアルタイム監視**: イベントリスナーによるコールバック
- **エラーハンドリング**: 包括的なエラー処理
- **TypeScript 対応**: 型安全な開発環境

### 技術仕様

- **JSI Bridge**: C++との高速通信
- **シングルトンパターン**: アプリ全体で単一インスタンス
- **非同期処理**: すべてのネイティブ呼び出しが非同期
- **イベント駆動**: コールバックベースの更新通知

---

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native UI                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  │    Settings     │  │   Visualizer    │  │   Preset Mgr    │
│  │   Component     │  │   Component     │  │   Component     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘
├─────────────────────────────────────────────────────────────┤
│                    NullOto JS Interface                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  │  Audio Control  │  │  Event Manager  │  │  Data Manager   │
│  │                 │  │                 │  │                 │
│  │  - start/stop   │  │  - callbacks    │  │  - presets      │
│  │  - settings     │  │  - listeners    │  │  - learning     │
│  │  - monitoring   │  │  - errors       │  │  - metrics      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘
├─────────────────────────────────────────────────────────────┤
│                      JSI Bridge                             │
└─────────────────────────────────────────────────────────────┘
```

---

## データ型

### 定数定義

```javascript
const PERMISSION_STATUS = {
  NOT_DETERMINED: 0, // 未決定
  GRANTED: 1, // 許可済み
  DENIED: 2, // 拒否
  RESTRICTED: 3, // 制限あり
};

const AUDIO_SESSION_STATE = {
  INACTIVE: 0, // 非アクティブ
  ACTIVE: 1, // アクティブ
  INTERRUPTED: 2, // 中断中
  ERROR: 3, // エラー
};

const ERROR_CATEGORIES = {
  AUDIO: "audio",
  PERMISSION: "permission",
  PROCESSING: "processing",
  STORAGE: "storage",
};
```

### AudioConfig 型

```javascript
interface AudioConfig {
  sampleRate: number; // サンプリングレート
  bufferSize: number; // バッファサイズ
  channels: number; // チャネル数
  bitDepth: number; // ビット深度
}
```

**使用例**:

```javascript
const config = {
  sampleRate: 48000,
  bufferSize: 512,
  channels: 1,
  bitDepth: 32,
};
await nullOto.setAudioConfig(config);
```

### NoiseAnalysisResult 型

```javascript
interface NoiseAnalysisResult {
  overallNoiseLevel: number; // 全体騒音レベル (dB)
  bandNoiseLevels: number[]; // 8バンド別騒音レベル
  cancellationEffect: number; // 消音効果量 (dB)
  currentAudioGainLevels: number[]; // UI表示用ゲインレベル
  currentLatency: number; // 現在のレイテンシー (ms)
  timestamp: string; // タイムスタンプ (ISO8601)
}
```

### SystemMetrics 型

```javascript
interface SystemMetrics {
  audioLatency: number; // 音声レイテンシー (ms)
  cpuUsage: number; // CPU使用率 (%)
  memoryUsage: number; // メモリ使用量 (MB)
  batteryConsumption: number; // バッテリー消費 (%/h)
  isRealTimeCapable: boolean; // リアルタイム処理可能
  processingLoad: number; // 処理負荷 (%)
}
```

### PresetData 型

```javascript
interface PresetData {
  name: string; // プリセット名
  memo: string; // メモ・説明
  baseGains: number[]; // 基本ゲイン設定（8要素）
  adaptiveGains: number[]; // 学習調整ゲイン（8要素）
  learningStats: LearningStats; // 学習統計データ
  creationTime: string; // 作成日時（ISO8601）
  lastUsedTime: string; // 最終使用日時
  updateTime: string; // 更新日時
  averageEffect: number; // 平均効果量 (dB)
  totalUsageTime: number; // 総使用時間 (時間)
  environmentType: string; // 環境タイプ
}
```

---

## メインクラス

### NullOto クラス

```javascript
class NullOto {
  // 1. 初期化・設定
  async initialize(): Promise<boolean>
  isInitialized(): boolean

  // 2. 音声設定
  async setAudioConfig(config: AudioConfig): Promise<boolean>
  async getAudioConfig(): Promise<AudioConfig | null>

  // 3. ANC制御
  async startNoiseCancellation(): Promise<boolean>
  async stopNoiseCancellation(): Promise<boolean>
  async isNoiseCancellationActive(): Promise<boolean>

  // 4. データ取得
  async getRealtimeNoiseAnalysis(): Promise<NoiseAnalysisResult | null>
  async getSystemMetrics(): Promise<SystemMetrics | null>

  // 5. イベント監視
  addRealtimeUpdateListener(callback: Function): Function
  addSystemMetricsListener(callback: Function): Function
  addErrorListener(callback: Function): Function
}
```

**シングルトンインスタンス**:

```javascript
import nullOto from "./NullOtoJSIModule";

// アプリ全体で同一インスタンスを使用
export default nullOto;
```

---

## 初期化・設定

### 1. アプリケーション起動時の初期化

```javascript
// App.js または index.js
import nullOto from "./NullOtoJSIModule";

async function initializeApp() {
  try {
    // 1. システム初期化
    const success = await nullOto.initialize();
    if (!success) {
      throw new Error("Failed to initialize NullOto");
    }

    // 2. 権限チェック
    const hasPermission = await nullOto.checkAllPermissions();
    if (!hasPermission) {
      await nullOto.requestMicrophonePermission();
    }

    // 3. 音声セッション設定
    await nullOto.configureAudioSession();

    // 4. 初期プリセット読み込み
    await nullOto.loadInitialPresets();

    console.log("NullOto initialized successfully");
  } catch (error) {
    console.error("NullOto initialization failed:", error);
  }
}
```

### 2. 音声設定の最適化

```javascript
async function optimizeAudioSettings() {
  try {
    // サポートされている設定を取得
    const supportedConfigs = await nullOto.getSupportedAudioConfigs();

    // 最適な設定を選択
    const optimalConfig = supportedConfigs.find(
      (config) => config.sampleRate >= 48000 && config.bufferSize <= 512
    );

    if (optimalConfig) {
      await nullOto.setAudioConfig(optimalConfig);
    }
  } catch (error) {
    console.error("Audio optimization failed:", error);
  }
}
```

### 3. 権限管理

```javascript
async function handlePermissions() {
  const status = await nullOto.getMicrophonePermissionStatus();

  switch (status) {
    case nullOto.PERMISSION_STATUS.NOT_DETERMINED:
      await nullOto.requestMicrophonePermission();
      break;
    case nullOto.PERMISSION_STATUS.DENIED:
      // ユーザーに設定画面への誘導を表示
      showPermissionAlert();
      break;
    case nullOto.PERMISSION_STATUS.GRANTED:
      // 正常に処理を継続
      break;
  }
}
```

---

## 音声処理

### 1. ANC 制御

```javascript
class AudioController {
  constructor() {
    this.isRunning = false;
    this.currentPreset = null;
  }

  async startANC() {
    try {
      const success = await nullOto.startNoiseCancellation();
      if (success) {
        this.isRunning = true;
        this.startMonitoring();
      }
      return success;
    } catch (error) {
      console.error("Failed to start ANC:", error);
      return false;
    }
  }

  async stopANC() {
    try {
      const success = await nullOto.stopNoiseCancellation();
      if (success) {
        this.isRunning = false;
        this.stopMonitoring();
      }
      return success;
    } catch (error) {
      console.error("Failed to stop ANC:", error);
      return false;
    }
  }

  async pauseANC() {
    return await nullOto.pauseNoiseCancellation();
  }

  async resumeANC() {
    return await nullOto.resumeNoiseCancellation();
  }
}
```

### 2. 手動カスタマイズ

```javascript
class EqualizerController {
  constructor() {
    this.frequencyBands = [];
    this.bandNames = [];
    this.currentGains = [];
  }

  async initialize() {
    this.frequencyBands = await nullOto.getFrequencyBands();
    this.bandNames = await nullOto.getFrequencyBandNames();
    this.currentGains = await nullOto.getBaseCancellationGains();
  }

  async updateGain(bandIndex, gainValue) {
    // 範囲チェック
    if (gainValue < -40 || gainValue > 20) {
      throw new Error("Gain value out of range (-40 to 20 dB)");
    }

    this.currentGains[bandIndex] = gainValue;
    await nullOto.setBaseCancellationGains(this.currentGains);
  }

  async resetToFlat() {
    this.currentGains = new Array(8).fill(0);
    await nullOto.setBaseCancellationGains(this.currentGains);
  }
}
```

### 3. リアルタイム監視

```javascript
class RealtimeMonitor {
  constructor() {
    this.listeners = [];
    this.unsubscribeCallbacks = [];
  }

  startMonitoring() {
    // リアルタイム更新の監視
    const unsubscribe1 = nullOto.addRealtimeUpdateListener((data) => {
      this.handleRealtimeUpdate(data);
    });

    // システムメトリクスの監視
    const unsubscribe2 = nullOto.addSystemMetricsListener((metrics) => {
      this.handleSystemMetrics(metrics);
    });

    this.unsubscribeCallbacks.push(unsubscribe1, unsubscribe2);
  }

  stopMonitoring() {
    this.unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    this.unsubscribeCallbacks = [];
  }

  handleRealtimeUpdate(data) {
    // UI更新
    this.updateVisualization(data);
    this.updateMetrics(data);
  }

  handleSystemMetrics(metrics) {
    // パフォーマンス監視
    if (metrics.cpuUsage > 80) {
      this.showPerformanceWarning();
    }

    if (metrics.audioLatency > 15) {
      this.showLatencyWarning();
    }
  }
}
```

---

## プリセット管理

### 1. プリセット操作

```javascript
class PresetManager {
  constructor() {
    this.presets = [];
    this.activePreset = null;
  }

  async loadAllPresets() {
    try {
      this.presets = await nullOto.getAllPresets();
      this.activePreset = await nullOto.getActivePresetName();
      return this.presets;
    } catch (error) {
      console.error("Failed to load presets:", error);
      return [];
    }
  }

  async savePreset(name, memo, gains, environmentType = "") {
    try {
      await nullOto.savePreset(name, memo, gains, environmentType);
      await this.loadAllPresets(); // リスト更新
      return true;
    } catch (error) {
      console.error("Failed to save preset:", error);
      return false;
    }
  }

  async activatePreset(name) {
    try {
      await nullOto.activatePreset(name);
      this.activePreset = name;
      return true;
    } catch (error) {
      console.error("Failed to activate preset:", error);
      return false;
    }
  }

  async deletePreset(name) {
    try {
      await nullOto.deletePreset(name);
      await this.loadAllPresets(); // リスト更新
      return true;
    } catch (error) {
      console.error("Failed to delete preset:", error);
      return false;
    }
  }
}
```

### 2. エクスポート・インポート

```javascript
class PresetIOManager {
  async exportPreset(name) {
    try {
      const jsonString = await nullOto.exportPreset(name);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to export preset:", error);
      return null;
    }
  }

  async exportAllPresets() {
    try {
      const jsonString = await nullOto.exportAllPresets();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to export all presets:", error);
      return null;
    }
  }

  async importPreset(presetData) {
    try {
      const jsonString = JSON.stringify(presetData);
      return await nullOto.importPreset(jsonString);
    } catch (error) {
      console.error("Failed to import preset:", error);
      return false;
    }
  }

  async sharePreset(name) {
    const presetData = await this.exportPreset(name);
    if (presetData) {
      // React Native Share APIを使用
      await Share.share({
        title: `Null-Oto プリセット: ${name}`,
        message: JSON.stringify(presetData, null, 2),
      });
    }
  }
}
```

---

## 学習機能

### 1. 適応学習制御

```javascript
class LearningController {
  constructor() {
    this.isLearningEnabled = false;
    this.learningStats = null;
  }

  async enableLearning() {
    try {
      await nullOto.setAdaptiveLearningEnabled(true);
      this.isLearningEnabled = true;
      return true;
    } catch (error) {
      console.error("Failed to enable learning:", error);
      return false;
    }
  }

  async disableLearning() {
    try {
      await nullOto.setAdaptiveLearningEnabled(false);
      this.isLearningEnabled = false;
      return true;
    } catch (error) {
      console.error("Failed to disable learning:", error);
      return false;
    }
  }

  async getLearningStats(presetName = null) {
    try {
      this.learningStats = await nullOto.getLearningStats(presetName);
      return this.learningStats;
    } catch (error) {
      console.error("Failed to get learning stats:", error);
      return null;
    }
  }

  async resetLearningData(presetName = null) {
    try {
      await nullOto.resetAdaptiveLearningData(presetName);
      return true;
    } catch (error) {
      console.error("Failed to reset learning data:", error);
      return false;
    }
  }
}
```

### 2. 学習データ管理

```javascript
class LearningDataManager {
  async checkDataSize() {
    try {
      const currentSize = await nullOto.getLearningDataSize();
      const maxSize = 200; // 200MB

      if (currentSize > maxSize * 0.9) {
        // 90%を超えたら警告
        this.showDataSizeWarning(currentSize, maxSize);
      }

      return currentSize;
    } catch (error) {
      console.error("Failed to check data size:", error);
      return 0;
    }
  }

  async cleanupData() {
    try {
      await nullOto.cleanupOldLearningData();
      return true;
    } catch (error) {
      console.error("Failed to cleanup data:", error);
      return false;
    }
  }

  async setMaxDataSize(sizeMB) {
    try {
      await nullOto.setLearningDataMaxSize(sizeMB);
      return true;
    } catch (error) {
      console.error("Failed to set max data size:", error);
      return false;
    }
  }

  showDataSizeWarning(current, max) {
    Alert.alert(
      "学習データ容量警告",
      `学習データが ${current.toFixed(1)}MB / ${max}MB に達しました。`,
      [
        { text: "キャンセル", style: "cancel" },
        { text: "クリーンアップ", onPress: () => this.cleanupData() },
      ]
    );
  }
}
```

---

## システム管理

### 1. 電源・バックグラウンド管理

```javascript
class PowerManager {
  constructor() {
    this.powerSaveMode = false;
    this.backgroundProcessing = false;
  }

  async enablePowerSaveMode() {
    try {
      await nullOto.setPowerSaveModeEnabled(true);
      this.powerSaveMode = true;
      return true;
    } catch (error) {
      console.error("Failed to enable power save mode:", error);
      return false;
    }
  }

  async enableBackgroundProcessing() {
    try {
      await nullOto.setBackgroundProcessingEnabled(true);
      this.backgroundProcessing = true;
      return true;
    } catch (error) {
      console.error("Failed to enable background processing:", error);
      return false;
    }
  }

  async handleAppStateChange(nextAppState) {
    try {
      await nullOto.handleAppStateChange(nextAppState);

      if (nextAppState === "background") {
        // バックグラウンドモードに移行
        await this.enablePowerSaveMode();
      } else if (nextAppState === "active") {
        // フォアグラウンドに復帰
        await nullOto.setPowerSaveModeEnabled(false);
      }
    } catch (error) {
      console.error("Failed to handle app state change:", error);
    }
  }
}
```

### 2. デバイス管理

```javascript
class DeviceManager {
  constructor() {
    this.audioDevices = [];
    this.currentDevice = null;
  }

  async handleDeviceChange() {
    try {
      await nullOto.handleDeviceChange();

      // 音声設定の再適用
      const config = await nullOto.getAudioConfig();
      if (config) {
        await nullOto.setAudioConfig(config);
      }

      return true;
    } catch (error) {
      console.error("Failed to handle device change:", error);
      return false;
    }
  }

  setupDeviceChangeListener() {
    // React Native Audio の デバイス変更監視
    const deviceChangeListener = () => {
      this.handleDeviceChange();
    };

    // プラットフォーム固有のイベントリスナー設定
    if (Platform.OS === "ios") {
      // iOS AVAudioSession interruption handling
    } else if (Platform.OS === "android") {
      // Android AudioManager device change handling
    }
  }
}
```

---

## エラー処理

### 1. エラー監視

```javascript
class ErrorHandler {
  constructor() {
    this.errorHistory = [];
    this.errorCallbacks = [];
  }

  initialize() {
    // エラーコールバック設定
    nullOto.addErrorListener((error) => {
      this.handleError(error);
    });
  }

  handleError(error) {
    console.error("NullOto Error:", error);

    this.errorHistory.push({
      ...error,
      timestamp: new Date().toISOString(),
    });

    // エラーカテゴリ別処理
    switch (error.errorCategory) {
      case nullOto.ERROR_CATEGORIES.AUDIO:
        this.handleAudioError(error);
        break;
      case nullOto.ERROR_CATEGORIES.PERMISSION:
        this.handlePermissionError(error);
        break;
      case nullOto.ERROR_CATEGORIES.PROCESSING:
        this.handleProcessingError(error);
        break;
      case nullOto.ERROR_CATEGORIES.STORAGE:
        this.handleStorageError(error);
        break;
    }
  }

  handleAudioError(error) {
    Alert.alert(
      "音声エラー",
      "音声処理でエラーが発生しました。デバイスを再起動してください。",
      [{ text: "OK", onPress: () => this.restartAudio() }]
    );
  }

  handlePermissionError(error) {
    Alert.alert(
      "権限エラー",
      "マイクの使用権限が必要です。設定から許可してください。",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "設定", onPress: () => Linking.openSettings() },
      ]
    );
  }

  async restartAudio() {
    try {
      await nullOto.stopNoiseCancellation();
      await nullOto.configureAudioSession();
      await nullOto.startNoiseCancellation();
    } catch (error) {
      console.error("Failed to restart audio:", error);
    }
  }
}
```

### 2. 診断機能

```javascript
class DiagnosticsManager {
  constructor() {
    this.isRunning = false;
    this.diagnosticData = [];
  }

  async startDiagnostics() {
    try {
      await nullOto.startDiagnostics();
      this.isRunning = true;
      return true;
    } catch (error) {
      console.error("Failed to start diagnostics:", error);
      return false;
    }
  }

  async stopDiagnostics() {
    try {
      await nullOto.stopDiagnostics();
      this.isRunning = false;
      return true;
    } catch (error) {
      console.error("Failed to stop diagnostics:", error);
      return false;
    }
  }

  async generateDiagnosticReport() {
    try {
      const errors = await nullOto.getRecentErrors();
      const metrics = await nullOto.getSystemMetrics();
      const status = await nullOto.getStatus();

      const report = {
        timestamp: new Date().toISOString(),
        systemStatus: status,
        systemMetrics: metrics,
        recentErrors: errors,
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version,
          // その他デバイス情報
        },
      };

      return report;
    } catch (error) {
      console.error("Failed to generate diagnostic report:", error);
      return null;
    }
  }
}
```

---

## イベント監視

### 1. リアルタイムイベント

```javascript
class RealtimeEventManager {
  constructor() {
    this.listeners = new Map();
  }

  subscribeToRealtimeUpdates(component, callback) {
    const unsubscribe = nullOto.addRealtimeUpdateListener(callback);
    this.listeners.set(component, unsubscribe);
    return unsubscribe;
  }

  subscribeToSystemMetrics(component, callback) {
    const unsubscribe = nullOto.addSystemMetricsListener(callback);
    this.listeners.set(`${component}_metrics`, unsubscribe);
    return unsubscribe;
  }

  unsubscribeComponent(component) {
    const unsubscribe = this.listeners.get(component);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(component);
    }
  }

  unsubscribeAll() {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners.clear();
  }
}
```

### 2. React フック統合

```javascript
// useNullOto.js
import { useState, useEffect, useCallback } from "react";
import nullOto from "./NullOtoJSIModule";

export function useNullOto() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeRealtimeUpdate;
    let unsubscribeSystemMetrics;
    let unsubscribeError;

    const initialize = async () => {
      try {
        const success = await nullOto.initialize();
        setIsInitialized(success);

        if (success) {
          // イベントリスナー設定
          unsubscribeRealtimeUpdate = nullOto.addRealtimeUpdateListener(
            (data) => {
              setCurrentMetrics(data);
            }
          );

          unsubscribeSystemMetrics = nullOto.addSystemMetricsListener(
            (metrics) => {
              setCurrentMetrics((prev) => ({ ...prev, system: metrics }));
            }
          );

          unsubscribeError = nullOto.addErrorListener((error) => {
            setError(error);
          });
        }
      } catch (err) {
        setError(err);
      }
    };

    initialize();

    return () => {
      if (unsubscribeRealtimeUpdate) unsubscribeRealtimeUpdate();
      if (unsubscribeSystemMetrics) unsubscribeSystemMetrics();
      if (unsubscribeError) unsubscribeError();
    };
  }, []);

  const startANC = useCallback(async () => {
    try {
      const success = await nullOto.startNoiseCancellation();
      setIsRunning(success);
      return success;
    } catch (err) {
      setError(err);
      return false;
    }
  }, []);

  const stopANC = useCallback(async () => {
    try {
      const success = await nullOto.stopNoiseCancellation();
      setIsRunning(!success);
      return success;
    } catch (err) {
      setError(err);
      return false;
    }
  }, []);

  return {
    isInitialized,
    isRunning,
    currentMetrics,
    error,
    startANC,
    stopANC,
    clearError: () => setError(null),
  };
}
```

---

## 実装ガイドライン

### 1. エラーハンドリングパターン

```javascript
// 推奨パターン
async function safeCall(operation, errorMessage) {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw new Error(`${errorMessage}: ${error.message}`);
  }
}

// 使用例
const result = await safeCall(
  () => nullOto.startNoiseCancellation(),
  "Failed to start noise cancellation"
);
```

### 2. 非同期処理のベストプラクティス

```javascript
// 複数の非同期処理の並行実行
async function parallelOperations() {
  try {
    const [config, presets, metrics] = await Promise.all([
      nullOto.getAudioConfig(),
      nullOto.getAllPresets(),
      nullOto.getSystemMetrics(),
    ]);

    return { config, presets, metrics };
  } catch (error) {
    console.error("Parallel operations failed:", error);
    throw error;
  }
}

// タイムアウト付きの処理
async function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
  });

  return Promise.race([promise, timeout]);
}
```

### 3. メモリ管理

```javascript
class ComponentManager {
  constructor() {
    this.subscriptions = [];
  }

  componentDidMount() {
    // リスナー登録
    const subscription = nullOto.addRealtimeUpdateListener(this.handleUpdate);
    this.subscriptions.push(subscription);
  }

  componentWillUnmount() {
    // リスナー解除
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }

  handleUpdate = (data) => {
    // 更新処理
  };
}
```

### 4. TypeScript サポート

```typescript
// types/nulloto.d.ts
declare module "NullOtoJSIModule" {
  interface AudioConfig {
    sampleRate: number;
    bufferSize: number;
    channels: number;
    bitDepth: number;
  }

  interface NoiseAnalysisResult {
    overallNoiseLevel: number;
    bandNoiseLevels: number[];
    cancellationEffect: number;
    currentAudioGainLevels: number[];
    currentLatency: number;
    timestamp: string;
  }

  class NullOto {
    initialize(): Promise<boolean>;
    startNoiseCancellation(): Promise<boolean>;
    stopNoiseCancellation(): Promise<boolean>;
    setAudioConfig(config: AudioConfig): Promise<boolean>;
    getRealtimeNoiseAnalysis(): Promise<NoiseAnalysisResult | null>;
    addRealtimeUpdateListener(
      callback: (data: NoiseAnalysisResult) => void
    ): () => void;
  }

  const nullOto: NullOto;
  export default nullOto;
}
```

### 5. デバッグ・ログ

```javascript
class Logger {
  static debug(message, data = null) {
    if (__DEV__) {
      console.log(`[NullOto Debug] ${message}`, data);
    }
  }

  static error(message, error = null) {
    console.error(`[NullOto Error] ${message}`, error);
  }

  static performance(operation, startTime) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`[NullOto Performance] ${operation}: ${duration}ms`);
  }
}

// 使用例
const startTime = Date.now();
await nullOto.startNoiseCancellation();
Logger.performance("Start ANC", startTime);
```

---

_最終更新: 2024 年 7 月 4 日_
