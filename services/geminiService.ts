import { GoogleGenAI, Type } from "@google/genai";
import { EstimateResult, BuildingStructure } from "../types";

// Helper to simulate delay for effect if needed
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateAiEstimate = async (
  area: number,
  structure: BuildingStructure,
  roadWidth: string
): Promise<EstimateResult> => {
  
  const apiKey = process.env.API_KEY;

  // Fallback logic if no API key is present (to ensure the demo works for the user immediately)
  if (!apiKey) {
    console.warn("No API Key found. Using fallback logic.");
    await delay(1500); // Simulate processing time
    return generateFallbackEstimate(area, structure);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
あなたは日本の解体工事の積算AIです。以下のルールで、JSONのみを出力してください。

【入力パラメータ】
- 構造: ${structure}
- 延床面積: ${area} 坪
- 前面道路幅員: ${roadWidth}

【出力仕様（JSON）】
items: Array<{ category, name, unit, quantity, unitPrice, total }>
notes: string
必ず quantity*unitPrice=total を満たすこと。金額は整数で円表示（カンマ不要）。

【見積構成（大項目例）】
- 共通仮設工事 / 直接仮設 / 内装工事 / 上屋解体 / 躯体工事（地上解体）/ 躯体工事（人力解体・該当時）/ 基礎解体 / 外構工事 / 産業廃棄物（処分費）/ 産業廃棄物（運搬費）/ 諸経費
構成は現場条件から必要最低限でよい。項目が不要なら出力しない。

【原価計算の基準】
- 直接工事費 = 大項目の合算
- 間接工事費 = 直接工事費 × 0.05
- 法定福利費 = 直接工事費 × 0.05
- 解体原価 = 直接工事費 + 間接工事費 + 法定福利費
- 利益額 = 解体原価 × (0.2/(1-0.2))
- 総額 = 解体原価 + 利益額

【人工・重機・アタッチメント 1日単価（参考）】
- 人工: 現場責任者 28000, OP 28000, 作業員 20000
- 重機: ミニ 8000, 0.25 10000, 0.45 15000, 0.7 20000, 1.2 25000, 1.6 35000, 3.2 50000
- アタッチ: バケット 5000, 小割 10000, 大割 15000, カッター 15000, ブレイカー 15000
数量は “◯人/◯日” “◯台/◯日” のように積算し、日数が空欄はあり得ない。

【共通仮設（例）】
- 木造: 仮囲い設置、安全管理費、石綿検体調査(1検体30000)
- 木造以外: 仮囲い、ゲート、仮設水道/電気、詰所、仮設トイレ、散水設備、交通誘導員、家屋調査、有害物質調査等
現場条件（道路幅員・接道・敷地規模）に応じて最小構成で数量設定。

【直接仮設】
- 前提: 建物3面に仮設（正面+左右）、重機運搬費は仮設費に含む
- 必須: 建物高さ、建築面積/延床面積
- 足場は枠足場(600/900)など。未入力の任意項目は出力しない。

【内装工事】
- 対象: 軽鉄・PB・床材・天井材・間仕切・設備類など（入力なければ省略）
- 歩掛り目安: 30–35(超早い)/20–25(標準早い)/15–20(標準やや遅い)/10–15(超遅い) m2/人日
- 数量は “人/日” で必ず日数を出す。

【躯体工事（地上解体）】
- 対象: 地上階（基礎除く）。標準機は0.25。規模に応じ補正。
- 木造は屋根構造（瓦/スレート等）を考慮。必要なら屋根撤去作業（人力）を追加。

【躯体工事（人力解体）】
- 対象: 木造等の手壊し。重機は使わない。数量は人/日。

【基礎解体】
- 対象: 地中基礎（布/ベタ/RC）。建築面積やコンクリ厚から数量化。

【外構】
- 舗装・塀・カーポート・物置・樹木・庭石・看板等、必要に応じて最小構成で積算。

【産業廃棄物】
- 種類別（コンクリガラ、木くず、金属、廃プラ、ガラス陶磁器、石膏ボード、石綿等）で発生量を算出し、処分費／運搬費を別計上。
- 係数・換算、処分単価・運搬費は添付の基準（メモ）を用い、整合性を担保。

【金額レンジの制約（重要・厳守）】
- 木造30坪の総額は 900,000〜1,100,000 円の範囲に収めること。
- 概ね面積に比例し、同条件で100坪なら 5,000,000 円前後になるよう一貫性を保つこと。
- 上記レンジから外れる出力は不可。外れそうな場合は数量や仮設の最小構成を調整してレンジ内に収める。

【出力上の注意】
- すべてJPYの税込前（税抜）で小計→税→合計はクライアント側で扱うため、itemsのみ正確に返す。
- 文面は日本語。数値以外に記号（円、カンマ）は不要。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  name: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
                },
                required: ["category", "name", "unit", "quantity", "unitPrice", "total"]
              }
            },
            notes: { type: Type.STRING }
          },
          required: ["items", "notes"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      const subTotal = data.items.reduce((acc: number, item: any) => acc + item.total, 0);
      const tax = Math.round(subTotal * 0.1);
      return {
        items: data.items,
        subTotal,
        tax,
        total: subTotal + tax,
        notes: data.notes || "AI試算結果に基づく概算見積もりです。"
      };
    }
    
    throw new Error("Empty response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return generateFallbackEstimate(area, structure);
  }
};

// Fallback algorithm for deterministic demo (structured like sample sheets)
const generateFallbackEstimate = (area: number, structure: BuildingStructure): EstimateResult => {
  const areaM2 = Math.max(10, area * 3.3);
  
  // m2単価（目安）: 木造5,000円/m2 をベースに、鉄骨・RCで上振れ
  let mainUnit = 5000; // Wood
  if (structure === BuildingStructure.S || structure === BuildingStructure.STEEL) mainUnit = 6500;
  if (structure === BuildingStructure.RC) mainUnit = 8000;
  if (structure === BuildingStructure.SRC) mainUnit = 9000;
  if (structure === BuildingStructure.OTHER) mainUnit = 5500;

  const items: EstimateResult["items"] = [];

  // 共通仮設工事
  items.push(
    { category: "共通仮設工事", name: "交通誘導員", unit: "式", quantity: 1, unitPrice: 20000, total: 20000 },
    { category: "共通仮設工事", name: "アスベスト調査費", unit: "式", quantity: 1, unitPrice: 30000, total: 30000 },
    { category: "共通仮設工事", name: "諸官庁届出費", unit: "式", quantity: 1, unitPrice: 10000, total: 10000 },
  );

  // 直接仮設
  // 枠足場面積は建物規模の0.8倍程度で簡易算定
  const scaffoldM2 = Math.max(20, Math.round(areaM2 * 0.8));
  items.push(
    { category: "直接仮設", name: "枠足場(600)", unit: "m2", quantity: scaffoldM2, unitPrice: 850, total: scaffoldM2 * 850 },
    { category: "直接仮設", name: "重機回送費", unit: "式", quantity: 1, unitPrice: 30000, total: 30000 },
  );

  // 上屋解体（概算: 原価項目の一例）
  // 稼働日数は規模/120m2で丸め
  const days = Math.max(1, Math.round(areaM2 / 120));
  items.push(
    { category: "上屋解体", name: "オペレーター", unit: "人/日", quantity: 1 * days, unitPrice: 23000, total: 23000 * days },
    { category: "上屋解体", name: "作業員", unit: "人/日", quantity: 2 * days, unitPrice: 18000, total: 2 * days * 18000 },
    { category: "上屋解体", name: "0.25", unit: "台/日", quantity: 1 * days, unitPrice: 6000, total: 6000 * days },
    { category: "上屋解体", name: "バケット", unit: "台/日", quantity: 1 * days, unitPrice: 5000, total: 5000 * days },
  );

  // 本体解体（m2単価）
  const mainTotal = Math.round(areaM2) * mainUnit;
  items.push({ category: "本体解体", name: `${structure} 本体解体`, unit: "m2", quantity: Math.round(areaM2), unitPrice: mainUnit, total: mainTotal });

  // 外構（簡易例）
  const parkingM2 = Math.round(areaM2 * 0.08);
  const blockM = Math.round(Math.sqrt(areaM2));
  items.push(
    { category: "外構工事", name: "駐車場土間", unit: "m2", quantity: Math.max(10, parkingM2), unitPrice: 500, total: Math.max(10, parkingM2) * 500 },
    { category: "外構工事", name: "ブロック塀", unit: "m", quantity: Math.max(10, blockM), unitPrice: 30000, total: Math.max(10, blockM) * 30000 },
  );

  // 産業廃棄物（処分費）- ざっくり配分
  const concrete = +(areaM2 * 0.08).toFixed(2);
  const wood = +(areaM2 * 0.02).toFixed(2);
  const mix = +(areaM2 * 0.015).toFixed(2);
  items.push(
    { category: "産業廃棄物(処分費)", name: "コンクリートガラ（基礎）", unit: "m3", quantity: concrete, unitPrice: 6000, total: Math.round(concrete * 6000) },
    { category: "産業廃棄物(処分費)", name: "木くず", unit: "m3", quantity: wood, unitPrice: 8000, total: Math.round(wood * 8000) },
    { category: "産業廃棄物(処分費)", name: "混合廃棄物", unit: "m3", quantity: mix, unitPrice: 25000, total: Math.round(mix * 25000) },
  );

  // 運搬費（簡易）
  items.push(
    { category: "産業廃棄物(運搬費)", name: "コンクリートガラ（合算）", unit: "t", quantity: +(concrete * 2.0 / 3).toFixed(2), unitPrice: 2000, total: Math.round((concrete * 2.0 / 3) * 2000) },
    { category: "産業廃棄物(運搬費)", name: "木くず（合算）", unit: "t", quantity: +(wood * 0.8).toFixed(2), unitPrice: 3500, total: Math.round((wood * 0.8) * 3500) },
  );

  // 諸経費
  items.push({ category: "諸経費", name: "現場管理費・事務費", unit: "式", quantity: 1, unitPrice: 100000, total: 100000 });

  const subTotal = items.reduce((acc, item) => acc + item.total, 0);
  const tax = Math.round(subTotal * 0.1);

  return { items, subTotal, tax, total: subTotal + tax, notes: "※この見積もりはデモ用の概算値です。詳細な現地調査により変動します。" };
};
