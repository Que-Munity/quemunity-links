'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Flame, Clock, Scale, ShoppingCart, Thermometer, ChevronDown, ChevronUp } from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const CUTS = {
  pork_butt_boneless: {
    name: 'Pork Butt – Boneless', group: 'Pulled Pork',
    yield: 0.60, avgPieceWeight: 8, internalTemp: 203, restMinutes: 60,
    // lbs/hr at each pit temp
    cookRate: { 200: 1.1, 225: 1.4, 250: 1.9, 275: 2.4, 300: 2.9 },
    perPerson: { snacks: 0.25, sandwiches: 0.33, plates: 0.50, generous: 0.67 },
    unit: 'lbs',
  },
  pork_butt_bone_in: {
    name: 'Pork Butt – Bone-In', group: 'Pulled Pork',
    yield: 0.55, avgPieceWeight: 9, internalTemp: 203, restMinutes: 60,
    cookRate: { 200: 1.0, 225: 1.3, 250: 1.75, 275: 2.2, 300: 2.65 },
    perPerson: { snacks: 0.25, sandwiches: 0.33, plates: 0.50, generous: 0.67 },
    unit: 'lbs',
  },
  picnic_shoulder: {
    name: 'Picnic Shoulder', group: 'Pulled Pork',
    yield: 0.55, avgPieceWeight: 9, internalTemp: 195, restMinutes: 60,
    cookRate: { 200: 0.9, 225: 1.2, 250: 1.6, 275: 2.0, 300: 2.4 },
    perPerson: { snacks: 0.25, sandwiches: 0.33, plates: 0.50, generous: 0.67 },
    unit: 'lbs',
  },
  brisket_packer: {
    name: 'Brisket – Whole Packer', group: 'Brisket',
    yield: 0.55, avgPieceWeight: 14, internalTemp: 203, restMinutes: 120,
    cookRate: { 200: 0.9, 225: 1.2, 250: 1.6, 275: 2.0, 300: 2.4 },
    perPerson: { snacks: 0.20, sandwiches: 0.33, plates: 0.50, generous: 0.67 },
    unit: 'lbs',
  },
  brisket_flat: {
    name: 'Brisket – Flat', group: 'Brisket',
    yield: 0.55, avgPieceWeight: 6, internalTemp: 203, restMinutes: 90,
    cookRate: { 200: 0.9, 225: 1.2, 250: 1.6, 275: 2.0, 300: 2.4 },
    perPerson: { snacks: 0.20, sandwiches: 0.33, plates: 0.50, generous: 0.67 },
    unit: 'lbs',
  },
  ribs_baby_back: {
    name: 'Baby Back Ribs', group: 'Ribs',
    yield: 0.45, avgPieceWeight: 2.5, internalTemp: 195, restMinutes: 20,
    // For ribs: cookRate stores total hours per rack (not lbs/hr)
    cookRate: { 200: 6, 225: 5.5, 250: 4.5, 275: 3.5, 300: 2.75 },
    // persons per rack by meal type
    perRack: { snacks: 4, sandwiches: 3, plates: 2, generous: 1.5 },
    perPerson: { snacks: 0.25, sandwiches: 0.33, plates: 0.45, generous: 0.60 },
    unit: 'racks',
  },
  ribs_spare: {
    name: 'Spare Ribs / St. Louis', group: 'Ribs',
    yield: 0.40, avgPieceWeight: 3, internalTemp: 195, restMinutes: 20,
    cookRate: { 200: 7, 225: 6.5, 250: 5.5, 275: 4.5, 300: 3.5 },
    perRack: { snacks: 5, sandwiches: 4, plates: 3, generous: 2 },
    perPerson: { snacks: 0.25, sandwiches: 0.33, plates: 0.45, generous: 0.60 },
    unit: 'racks',
  },
  chicken_whole: {
    name: 'Whole Chicken', group: 'Poultry',
    yield: 0.65, avgPieceWeight: 4, internalTemp: 165, restMinutes: 20,
    cookRate: { 200: 1.5, 225: 2.0, 250: 2.5, 275: 3.0, 300: 3.5 },
    perPerson: { snacks: 0.20, sandwiches: 0.30, plates: 0.45, generous: 0.60 },
    unit: 'lbs',
  },
  chicken_halves: {
    name: 'Chicken Halves', group: 'Poultry',
    yield: 0.65, avgPieceWeight: 2, internalTemp: 165, restMinutes: 15,
    cookRate: { 200: 1.5, 225: 2.0, 250: 2.5, 275: 3.0, 300: 3.5 },
    perPerson: { snacks: 0.20, sandwiches: 0.30, plates: 0.45, generous: 0.60 },
    unit: 'lbs',
  },
  turkey: {
    name: 'Turkey – Whole', group: 'Poultry',
    yield: 0.55, avgPieceWeight: 14, internalTemp: 165, restMinutes: 45,
    cookRate: { 200: 1.1, 225: 1.5, 250: 2.0, 275: 2.5, 300: 3.0 },
    perPerson: { snacks: 0.20, sandwiches: 0.33, plates: 0.50, generous: 0.67 },
    unit: 'lbs',
  },
} as const;

type CutKey = keyof typeof CUTS;
type MealType = 'snacks' | 'sandwiches' | 'plates' | 'generous';
type WrapMethod = 'none' | 'butcher' | 'foil';
type PitTemp = 200 | 225 | 250 | 275 | 300;
type Buffer = 0 | 10 | 15 | 25;

const WRAP_FACTOR: Record<WrapMethod, number> = { none: 1.0, butcher: 0.85, foil: 0.80 };

const MEAL_LABELS: Record<MealType, string> = {
  snacks: 'Snacks / Sliders',
  sandwiches: 'Sandwiches',
  plates: 'Plates with Sides',
  generous: 'Generous Portions',
};

const BUFFER_LABELS: Record<Buffer, string> = {
  0: 'Exact (0%)',
  10: 'Small (+10%)',
  15: 'Recommended (+15%)',
  25: 'Generous (+25%)',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatWeight(lbs: number, metric: boolean) {
  if (metric) return `${(lbs * 0.453592).toFixed(1)} kg`;
  return `${lbs.toFixed(1)} lbs`;
}

function formatTime(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function addMinutesToDate(base: Date, mins: number) {
  return new Date(base.getTime() + mins * 60000);
}

function fmtClock(d: Date) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BBQCalculatorPage() {
  const [cut, setCut] = useState<CutKey>('pork_butt_boneless');
  const [adults, setAdults] = useState(10);
  const [kids, setKids] = useState(0);
  const [mealType, setMealType] = useState<MealType>('plates');
  const [metric, setMetric] = useState(false);
  const [pitTemp, setPitTemp] = useState<PitTemp>(225);
  const [wrap, setWrap] = useState<WrapMethod>('butcher');
  const [buffer, setBuffer] = useState<Buffer>(15);
  const [serveTime, setServeTime] = useState('18:00');
  const [serveDate, setServeDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customWeights, setCustomWeights] = useState('');

  const cutData = CUTS[cut];
  const isRibs = 'perRack' in cutData;

  const results = useMemo(() => {
    const totalPeople = adults + kids * 0.5;
    const perPersonLbs = cutData.perPerson[mealType];
    const cookedNeededLbs = totalPeople * perPersonLbs;
    const cookedWithBuffer = cookedNeededLbs * (1 + buffer / 100);
    const rawNeededLbs = cookedWithBuffer / cutData.yield;

    // Pieces
    let pieces: number;
    let recommendedRawLbs: number;

    if (customWeights.trim()) {
      const weights = customWeights.split(',').map(w => parseFloat(w.trim())).filter(w => !isNaN(w) && w > 0);
      pieces = weights.length;
      recommendedRawLbs = weights.reduce((a, b) => a + b, 0);
    } else if (isRibs) {
      const perRack = (cutData as any).perRack[mealType];
      pieces = Math.ceil(totalPeople / perRack);
      recommendedRawLbs = pieces * cutData.avgPieceWeight;
    } else {
      pieces = Math.max(1, Math.ceil(rawNeededLbs / cutData.avgPieceWeight));
      recommendedRawLbs = pieces * cutData.avgPieceWeight;
    }

    // Cook time: based on heaviest single piece
    const pieceWeight = customWeights.trim()
      ? Math.max(...customWeights.split(',').map(w => parseFloat(w.trim())).filter(w => !isNaN(w) && w > 0))
      : cutData.avgPieceWeight;

    const rawCookRate = (cutData.cookRate as any)[pitTemp];
    let cookHours: number;

    if (isRibs) {
      // cookRate is total hours per rack
      cookHours = rawCookRate * WRAP_FACTOR[wrap];
    } else {
      cookHours = (pieceWeight / rawCookRate) * WRAP_FACTOR[wrap];
    }

    const restHours = cutData.restMinutes / 60;
    const bufferHours = cookHours * (buffer / 100);
    const totalHours = cookHours + restHours + bufferHours;

    // Timeline
    let startTime: Date | null = null;
    let wrapTime: Date | null = null;
    let offTime: Date | null = null;
    let restEnd: Date | null = null;

    if (serveDate && serveTime) {
      const serve = new Date(`${serveDate}T${serveTime}`);
      restEnd = serve;
      offTime = addMinutesToDate(serve, -cutData.restMinutes);
      startTime = addMinutesToDate(offTime, -(cookHours * 60));
      if (wrap !== 'none') {
        // Wrap typically happens at stall (~165°F), roughly 60% into cook
        wrapTime = addMinutesToDate(startTime, cookHours * 0.6 * 60);
      }
    }

    return {
      cookedNeededLbs,
      cookedWithBuffer,
      rawNeededLbs,
      recommendedRawLbs,
      pieces,
      cookHours,
      restHours,
      totalHours,
      internalTemp: cutData.internalTemp,
      startTime,
      wrapTime,
      offTime,
      restEnd,
      pieceWeight,
    };
  }, [cut, adults, kids, mealType, pitTemp, wrap, buffer, serveDate, serveTime, customWeights, cutData, isRibs]);

  const groups = [...new Set(Object.values(CUTS).map(c => c.group))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link href="/tools" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Tools
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 rounded-full p-3">
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BBQ Calculator</h1>
              <p className="text-gray-500">How much meat to buy, when to start cooking</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── LEFT PANEL: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Units */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Units</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button onClick={() => setMetric(false)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${!metric ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Imperial
                </button>
                <button onClick={() => setMetric(true)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${metric ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Metric
                </button>
              </div>
            </div>

            {/* Meat Cut */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meat Cut</label>
              <select
                value={cut}
                onChange={e => setCut(e.target.value as CutKey)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {groups.map(group => (
                  <optgroup key={group} label={group}>
                    {(Object.entries(CUTS) as [CutKey, typeof CUTS[CutKey]][])
                      .filter(([, c]) => c.group === group)
                      .map(([key, c]) => (
                        <option key={key} value={key}>{c.name}</option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Users className="inline w-4 h-4 mr-1 text-orange-500" />Guests
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Adults</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setAdults(a => Math.max(0, a - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-bold">−</button>
                    <span className="flex-1 text-center font-semibold text-gray-900">{adults}</span>
                    <button onClick={() => setAdults(a => a + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Kids <span className="text-gray-400">(½ portion)</span></label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setKids(k => Math.max(0, k - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-bold">−</button>
                    <span className="flex-1 text-center font-semibold text-gray-900">{kids}</span>
                    <button onClick={() => setKids(k => k + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Type */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Serving Style</label>
              <div className="space-y-2">
                {(Object.entries(MEAL_LABELS) as [MealType, string][]).map(([key, label]) => (
                  <label key={key} className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-colors ${mealType === key ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                    <input type="radio" name="meal" value={key} checked={mealType === key} onChange={() => setMealType(key)} className="accent-orange-500" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cook Settings */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
              <p className="text-sm font-semibold text-gray-700">Cook Settings</p>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Pit Temperature</label>
                <div className="flex gap-1.5 flex-wrap">
                  {([200, 225, 250, 275, 300] as PitTemp[]).map(t => (
                    <button key={t} onClick={() => setPitTemp(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors ${pitTemp === t ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                      {t}°F
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Wrap Method</label>
                <select value={wrap} onChange={e => setWrap(e.target.value as WrapMethod)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="none">No Wrap (Texas Crutch-free)</option>
                  <option value="butcher">Butcher Paper</option>
                  <option value="foil">Aluminum Foil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Safety Buffer</label>
                <div className="space-y-1.5">
                  {(Object.entries(BUFFER_LABELS) as [string, string][]).map(([val, label]) => (
                    <label key={val} className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-colors ${buffer === Number(val) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                      <input type="radio" name="buffer" value={val} checked={buffer === Number(val)} onChange={() => setBuffer(Number(val) as Buffer)} className="accent-orange-500" />
                      <span className="text-xs font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Serve Time */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-1 text-orange-500" />When are you serving?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input type="date" value={serveDate} onChange={e => setServeDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Time</label>
                  <input type="time" value={serveTime} onChange={e => setServeTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            {/* Advanced */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Advanced: Enter actual piece weights
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showAdvanced && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-500 mb-2">Enter weights separated by commas (e.g. 8.5, 9.2, 7.8)</p>
                  <input
                    type="text"
                    value={customWeights}
                    onChange={e => setCustomWeights(e.target.value)}
                    placeholder="8.5, 9.2, 7.8"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: Results ─────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">

            {/* Meat Quantities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                How Much to Buy
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-medium text-orange-700 uppercase tracking-wide mb-1">Cooked Meat Needed</p>
                  <p className="text-3xl font-bold text-orange-600">{formatWeight(results.cookedWithBuffer, metric)}</p>
                  <p className="text-xs text-orange-500 mt-1">incl. {buffer}% buffer</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-medium text-red-700 uppercase tracking-wide mb-1">Raw Meat Needed</p>
                  <p className="text-3xl font-bold text-red-600">{formatWeight(results.rawNeededLbs, metric)}</p>
                  <p className="text-xs text-red-500 mt-1">{Math.round(cutData.yield * 100)}% yield after cooking</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Estimated Pieces</p>
                  <p className="text-3xl font-bold text-gray-800">{results.pieces}</p>
                  <p className="text-xs text-gray-500 mt-1">{isRibs ? 'racks' : `~${cutData.avgPieceWeight} lbs each`}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Recommended Purchase</p>
                  <p className="text-3xl font-bold text-green-600">
                    {isRibs ? `${results.pieces} racks` : formatWeight(results.recommendedRawLbs, metric)}
                  </p>
                  <p className="text-xs text-green-500 mt-1">whole-cut amounts</p>
                </div>
              </div>
            </div>

            {/* Cook Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-500" />
                Cook Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Target Temp</p>
                  <p className="text-2xl font-bold text-gray-800">{cutData.internalTemp}°F</p>
                  <p className="text-xs text-gray-400">{Math.round((cutData.internalTemp - 32) * 5 / 9)}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Est. Cook Time</p>
                  <p className="text-2xl font-bold text-gray-800">{formatTime(results.cookHours)}</p>
                  <p className="text-xs text-gray-400">at {pitTemp}°F pit</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Rest / Hold</p>
                  <p className="text-2xl font-bold text-gray-800">{formatTime(results.restHours)}</p>
                  <p className="text-xs text-gray-400">before serving</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Time</p>
                  <p className="text-2xl font-bold text-orange-600">{formatTime(results.totalHours)}</p>
                  <p className="text-xs text-gray-400">start to table</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {results.startTime ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Cook Timeline
                </h2>
                <div className="relative">
                  <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-orange-200" />
                  <div className="space-y-5">
                    <TimelineEvent
                      time={fmtClock(results.startTime)}
                      label="Fire up the smoker"
                      detail={`Preheat to ${pitTemp}°F`}
                      color="bg-red-500"
                      icon="🔥"
                    />
                    <TimelineEvent
                      time={fmtClock(results.startTime)}
                      label="Meat goes on"
                      detail={`${results.pieces} ${isRibs ? 'rack(s)' : `piece(s) — ${results.pieceWeight} lbs heaviest`}`}
                      color="bg-orange-500"
                      icon="🥩"
                    />
                    {results.wrapTime && (
                      <TimelineEvent
                        time={fmtClock(results.wrapTime)}
                        label={wrap === 'foil' ? 'Wrap in foil' : 'Wrap in butcher paper'}
                        detail="Around the stall (~165°F)"
                        color="bg-yellow-500"
                        icon="📦"
                      />
                    )}
                    {results.offTime && (
                      <TimelineEvent
                        time={fmtClock(results.offTime)}
                        label="Off the smoker"
                        detail={`Target internal: ${cutData.internalTemp}°F`}
                        color="bg-blue-500"
                        icon="✅"
                      />
                    )}
                    <TimelineEvent
                      time={fmtClock(results.restEnd!)}
                      label="Serve!"
                      detail={`${adults + kids} guests, ${MEAL_LABELS[mealType].toLowerCase()}`}
                      color="bg-green-500"
                      icon="🍽️"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Enter a serve date & time to see your cook timeline</p>
              </div>
            )}

            {/* Tips */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4" /> Pit Tips for {cutData.name}
              </h3>
              <ul className="space-y-1.5 text-sm text-orange-800">
                <li>• Target internal temp: <strong>{cutData.internalTemp}°F</strong> — use a probe thermometer, not just time</li>
                <li>• Rest time matters — wrap in a towel and cooler to hold temp</li>
                {wrap === 'foil' && <li>• Foil wrap speeds the stall but softens bark — unwrap the last 30 min to firm it up</li>}
                {wrap === 'butcher' && <li>• Butcher paper lets moisture breathe — better bark than foil with similar speed benefit</li>}
                {wrap === 'none' && <li>• No wrap = fullest bark development, but expect a longer stall around 150–165°F</li>}
                <li>• Recommended purchase is higher than the minimum to account for real-world package sizes</li>
                <li>• {buffer > 0 ? `Your ${buffer}% safety buffer adds wiggle room if the cook runs long` : 'Consider adding a safety buffer — BBQ rarely finishes exactly on time'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineEvent({ time, label, detail, color, icon }: {
  time: string; label: string; detail: string; color: string; icon: string;
}) {
  return (
    <div className="flex items-start gap-4 relative">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-lg flex-shrink-0 z-10`}>
        {icon}
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base font-bold text-gray-900">{time}</span>
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
