export enum BuildingStructure {
  WOOD = '木造',
  S = 'S造',
  RC = 'RC造',
  SRC = 'SRC造',
  OTHER = 'その他',
  // 互換性キープ（旧UIの鉄骨造）
  STEEL = '鉄骨造',
}

export interface EstimateItem {
  category: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isAiGenerated?: boolean;
}

export interface EstimateResult {
  items: EstimateItem[];
  subTotal: number;
  tax: number;
  total: number;
  notes: string;
}

export interface DemoInputState {
  area: number; // in tsubo
  structure: BuildingStructure;
  hasAsbestos: boolean;
  roadWidth: 'narrow' | 'normal' | 'wide';
}

// Heavy machine row (demo用の簡易型)
export interface MachineSpec {
  machineType: string;     // 例: "0.25"
  attachment: string;      // 例: "バケット"
  configuration: string;   // 例: "スタンダード"
  units: number;           // 台数
  operators: number;       // オペレーター数
}

// 追加の入力値（UIで保持するだけ。見積計算の必須ではない）
export interface ExtendedInputState {
  usage: string;                 // 用途（コード）
  floors: number;                // 階数
  heightM: number;               // 高さ(m)
  buildingAreaM2: number;        // 建築面積
  totalFloorAreaM2: number;      // 延床面積
  areaUnit: 'm2' | 'tsubo';      // 表示単位
  machines: MachineSpec[];       // 重機
  numAssistWorkers: number;      // 手元作業員人数
  numGasWorkers: number;         // ガス工人数
}
