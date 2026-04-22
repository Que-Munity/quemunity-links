'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, ChefHat } from 'lucide-react';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  preparation: string;
  optional: boolean;
}

interface Instruction {
  title: string;
  description: string;
  temperature: string;
  time: string;
}

const COOKING_METHODS = [
  'SMOKING', 'PELLET_SMOKER', 'OFFSET_SMOKER', 'GRILLING',
  'ROASTING', 'BRAISING', 'FRYING', 'BAKING', 'STEAMING', 'BOILING', 'OTHER',
];

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

export default function CreateRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'ingredients' | 'instructions' | 'details'>('basics');

  const [basics, setBasics] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'MEDIUM',
    cookingMethod: 'SMOKING',
  });

  const [bbqDetails, setBbqDetails] = useState({
    smokingWood: '',
    smokerTemp: '',
    internalTemp: '',
    sauce: '',
    seasoningRub: '',
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '', preparation: '', optional: false },
  ]);

  const [instructions, setInstructions] = useState<Instruction[]>([
    { title: '', description: '', temperature: '', time: '' },
  ]);

  const [tags, setTags] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (!session?.user) {
    router.push('/auth/signin?callbackUrl=/recipes/create');
    return null;
  }

  const addIngredient = () =>
    setIngredients(prev => [...prev, { name: '', amount: '', unit: '', preparation: '', optional: false }]);

  const removeIngredient = (i: number) =>
    setIngredients(prev => prev.filter((_, idx) => idx !== i));

  const updateIngredient = (i: number, field: keyof Ingredient, value: string | boolean) =>
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));

  const addInstruction = () =>
    setInstructions(prev => [...prev, { title: '', description: '', temperature: '', time: '' }]);

  const removeInstruction = (i: number) =>
    setInstructions(prev => prev.filter((_, idx) => idx !== i));

  const updateInstruction = (i: number, field: keyof Instruction, value: string) =>
    setInstructions(prev => prev.map((ins, idx) => idx === i ? { ...ins, [field]: value } : ins));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const validIngredients = ingredients.filter(i => i.name.trim() && i.amount);
    const validInstructions = instructions.filter(i => i.description.trim());

    if (!basics.title.trim()) { alert('Recipe title is required'); return; }
    if (!basics.description.trim()) { alert('Recipe description is required'); return; }
    if (validIngredients.length === 0) { alert('Add at least one ingredient'); return; }
    if (validInstructions.length === 0) { alert('Add at least one instruction step'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: basics.title.trim(),
          description: basics.description.trim(),
          prepTime: parseInt(basics.prepTime) || 0,
          cookTime: parseInt(basics.cookTime) || 0,
          servings: parseInt(basics.servings) || 4,
          difficulty: basics.difficulty,
          cookingMethod: basics.cookingMethod,
          smokingWood: bbqDetails.smokingWood || undefined,
          smokerTemp: bbqDetails.smokerTemp ? parseInt(bbqDetails.smokerTemp) : undefined,
          internalTemp: bbqDetails.internalTemp ? parseInt(bbqDetails.internalTemp) : undefined,
          sauce: bbqDetails.sauce || undefined,
          seasoningRub: bbqDetails.seasoningRub || undefined,
          ingredients: validIngredients.map(ing => ({
            name: ing.name.trim(),
            amount: parseFloat(ing.amount) || 1,
            unit: ing.unit.trim() || 'piece',
            preparation: ing.preparation.trim() || undefined,
            optional: ing.optional,
            category: 'OTHER',
          })),
          instructions: validInstructions.map(ins => ({
            title: ins.title.trim() || undefined,
            description: ins.description.trim(),
            temperature: ins.temperature ? parseInt(ins.temperature) : undefined,
            time: ins.time ? parseInt(ins.time) : undefined,
          })),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        const recipe = await res.json();
        router.push(`/recipes/${recipe.id}`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create recipe');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basics', label: 'Basics' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'instructions', label: 'Instructions' },
    { id: 'details', label: 'BBQ Details' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/recipes" className="flex items-center text-gray-600 hover:text-orange-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Link>
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Recipe</h1>
              <p className="text-gray-600 mt-1">Share your BBQ masterpiece with the community</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Basics Tab */}
          {activeTab === 'basics' && (
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title *</label>
                <input
                  type="text" required value={basics.title}
                  onChange={e => setBasics(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Texas-Style Smoked Brisket"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required rows={4} value={basics.description}
                  onChange={e => setBasics(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your recipe and what makes it special..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (min)</label>
                  <input
                    type="number" min="0" value={basics.prepTime}
                    onChange={e => setBasics(p => ({ ...p, prepTime: e.target.value }))}
                    placeholder="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time (min)</label>
                  <input
                    type="number" min="0" value={basics.cookTime}
                    onChange={e => setBasics(p => ({ ...p, cookTime: e.target.value }))}
                    placeholder="720"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                  <input
                    type="number" min="1" value={basics.servings}
                    onChange={e => setBasics(p => ({ ...p, servings: e.target.value }))}
                    placeholder="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={basics.difficulty}
                    onChange={e => setBasics(p => ({ ...p, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Method *</label>
                  <select
                    value={basics.cookingMethod}
                    onChange={e => setBasics(p => ({ ...p, cookingMethod: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {COOKING_METHODS.map(m => (
                      <option key={m} value={m}>{m.replace(/_/g, ' ').charAt(0) + m.replace(/_/g, ' ').slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text" value={tags}
                    onChange={e => setTags(e.target.value)}
                    placeholder="brisket, texas, oak, competition"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setActiveTab('ingredients')} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium">
                  Next: Ingredients →
                </button>
              </div>
            </div>
          )}

          {/* Ingredients Tab */}
          {activeTab === 'ingredients' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <div className="space-y-4">
                {ingredients.map((ing, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-start bg-gray-50 p-4 rounded-lg">
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Ingredient *</label>
                      <input
                        type="text" value={ing.name}
                        onChange={e => updateIngredient(i, 'name', e.target.value)}
                        placeholder="e.g., Beef brisket"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Amount *</label>
                      <input
                        type="text" value={ing.amount}
                        onChange={e => updateIngredient(i, 'amount', e.target.value)}
                        placeholder="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                      <input
                        type="text" value={ing.unit}
                        onChange={e => updateIngredient(i, 'unit', e.target.value)}
                        placeholder="lbs"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Prep</label>
                      <input
                        type="text" value={ing.preparation}
                        onChange={e => updateIngredient(i, 'preparation', e.target.value)}
                        placeholder="trimmed"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="col-span-1 flex items-end justify-end pb-2">
                      {ingredients.length > 1 && (
                        <button type="button" onClick={() => removeIngredient(i)} className="p-2 text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addIngredient} className="mt-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                <Plus className="w-4 h-4" /> Add Ingredient
              </button>
              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setActiveTab('basics')} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">
                  ← Back
                </button>
                <button type="button" onClick={() => setActiveTab('instructions')} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium">
                  Next: Instructions →
                </button>
              </div>
            </div>
          )}

          {/* Instructions Tab */}
          {activeTab === 'instructions' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Step-by-Step Instructions</h2>
              <div className="space-y-6">
                {instructions.map((ins, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <input
                        type="text" value={ins.title}
                        onChange={e => updateInstruction(i, 'title', e.target.value)}
                        placeholder="Step title (optional)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      {instructions.length > 1 && (
                        <button type="button" onClick={() => removeInstruction(i)} className="p-2 text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <textarea
                      required rows={3} value={ins.description}
                      onChange={e => updateInstruction(i, 'description', e.target.value)}
                      placeholder="Describe this step in detail..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 resize-none mb-3"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Temperature (°F)</label>
                        <input
                          type="number" value={ins.temperature}
                          onChange={e => updateInstruction(i, 'temperature', e.target.value)}
                          placeholder="225"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Time (minutes)</label>
                        <input
                          type="number" value={ins.time}
                          onChange={e => updateInstruction(i, 'time', e.target.value)}
                          placeholder="60"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addInstruction} className="mt-4 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                <Plus className="w-4 h-4" /> Add Step
              </button>
              <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setActiveTab('ingredients')} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">
                  ← Back
                </button>
                <button type="button" onClick={() => setActiveTab('details')} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium">
                  Next: BBQ Details →
                </button>
              </div>
            </div>
          )}

          {/* BBQ Details Tab */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">BBQ-Specific Details</h2>
              <p className="text-gray-500 text-sm -mt-4 mb-6">Optional but recommended for BBQ recipes</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Wood</label>
                  <input
                    type="text" value={bbqDetails.smokingWood}
                    onChange={e => setBbqDetails(p => ({ ...p, smokingWood: e.target.value }))}
                    placeholder="e.g., Oak, Hickory, Apple"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Smoker Temperature (°F)</label>
                  <input
                    type="number" value={bbqDetails.smokerTemp}
                    onChange={e => setBbqDetails(p => ({ ...p, smokerTemp: e.target.value }))}
                    placeholder="225"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Internal Temp (°F)</label>
                  <input
                    type="number" value={bbqDetails.internalTemp}
                    onChange={e => setBbqDetails(p => ({ ...p, internalTemp: e.target.value }))}
                    placeholder="203"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BBQ Sauce</label>
                  <input
                    type="text" value={bbqDetails.sauce}
                    onChange={e => setBbqDetails(p => ({ ...p, sauce: e.target.value }))}
                    placeholder="e.g., Kansas City, Texas Mop"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seasoning Rub</label>
                <input
                  type="text" value={bbqDetails.seasoningRub}
                  onChange={e => setBbqDetails(p => ({ ...p, seasoningRub: e.target.value }))}
                  placeholder="e.g., Salt & Pepper, Dalmatian Rub"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button type="button" onClick={() => setActiveTab('instructions')} className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-semibold text-lg"
                >
                  <ChefHat className="w-5 h-5" />
                  {submitting ? 'Publishing...' : 'Publish Recipe'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
