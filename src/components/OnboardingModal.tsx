'use client';

import { useState } from 'react';
import { Flame, ChevronRight, Check } from 'lucide-react';

const STEPS = ['meats', 'cooker', 'skill', 'style'] as const;

const MEAT_OPTIONS = ['Brisket', 'Ribs', 'Pulled Pork', 'Chicken', 'Sausage', 'Fish', 'Lamb', 'Wild Game'];
const COOKER_OPTIONS = ['Offset Smoker', 'Kettle Grill', 'Pellet Grill', 'Kamado (Big Green Egg)', 'Gas Grill', 'Cabinet Smoker', 'Drum Smoker'];
const SKILL_OPTIONS = ['Just Starting Out', 'Backyard Cook', 'Experienced Pitmaster', 'Competition BBQ'];
const STYLE_OPTIONS = ['Texas BBQ', 'Kansas City', 'Carolina', 'Memphis', 'Global Fusion', 'Anything Goes!'];

interface OnboardingModalProps {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [favoriteMeats, setFavoriteMeats] = useState<string[]>([]);
  const [cookerType, setCookerType] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [bbqStyle, setBbqStyle] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleMeat = (meat: string) => {
    setFavoriteMeats(prev =>
      prev.includes(meat) ? prev.filter(m => m !== meat) : [...prev, meat]
    );
  };

  const canNext = () => {
    if (step === 0) return favoriteMeats.length > 0;
    if (step === 1) return !!cookerType;
    if (step === 2) return !!skillLevel;
    if (step === 3) return !!bbqStyle;
    return false;
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoriteMeats, cookerType, skillLevel, bbqStyle }),
      });
    } catch {}
    onClose();
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-6 h-6" />
            <span className="text-lg font-bold">Welcome to Que-Munity!</span>
          </div>
          <p className="text-orange-100 text-sm">Let's set up your BBQ profile</p>
          <div className="mt-3 bg-white/30 rounded-full h-1.5">
            <div
              className="bg-white rounded-full h-1.5 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-orange-100 mt-1">Step {step + 1} of {STEPS.length}</p>
        </div>

        <div className="px-6 py-6">
          {/* Step 0: Favorite Meats */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What do you love to smoke?</h2>
              <p className="text-gray-500 text-sm mb-4">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {MEAT_OPTIONS.map(meat => (
                  <button
                    key={meat}
                    onClick={() => toggleMeat(meat)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                      favoriteMeats.includes(meat)
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {favoriteMeats.includes(meat) && <Check className="w-3 h-3 inline mr-1" />}
                    {meat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Cooker Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What's your setup?</h2>
              <p className="text-gray-500 text-sm mb-4">Choose your primary cooker</p>
              <div className="space-y-2">
                {COOKER_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setCookerType(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      cookerType === opt
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skill Level */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">How seasoned are you?</h2>
              <p className="text-gray-500 text-sm mb-4">Be honest — we all start somewhere!</p>
              <div className="space-y-2">
                {SKILL_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSkillLevel(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      skillLevel === opt
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: BBQ Style */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What's your BBQ style?</h2>
              <p className="text-gray-500 text-sm mb-4">Every region has its own flavor</p>
              <div className="space-y-2">
                {STYLE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setBbqStyle(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      bbqStyle === opt
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex items-center justify-between">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
              Back
            </button>
          ) : (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
              Skip for now
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canNext() || saving}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
            >
              {saving ? 'Saving...' : '🔥 Let\'s Go!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
