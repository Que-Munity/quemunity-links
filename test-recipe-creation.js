const testRecipe = {
  title: "Championship Smoked Brisket",
  description: "A competition-grade Texas-style brisket with a perfect bark and tender, juicy meat. This recipe has won multiple BBQ competitions and is perfect for impressing friends and family.",
  prepTime: 60,
  cookTime: 720, // 12 hours
  servings: 8,
  difficulty: "MEDIUM",
  cookingMethod: "SMOKING", 
  smokingWood: "Oak and Hickory",
  smokerTemp: 225,
  internalTemp: 203,
  ingredients: [
    {
      name: "Whole Packer Brisket",
      amount: "12-15",
      unit: "lbs",
      notes: "USDA Prime or Choice grade"
    },
    {
      name: "Coarse Black Pepper",
      amount: "1/2",
      unit: "cup",
      notes: "Freshly cracked"
    },
    {
      name: "Coarse Kosher Salt",
      amount: "1/2",
      unit: "cup",
      notes: ""
    },
    {
      name: "Garlic Powder",
      amount: "2",
      unit: "tbsp",
      notes: ""
    },
    {
      name: "Oak Wood Chunks",
      amount: "6-8",
      unit: "pieces",
      notes: "Soaked for 30 minutes"
    }
  ],
  instructions: [
    {
      stepNumber: 1,
      title: "Trim the Brisket",
      description: "Remove excess fat, leaving about 1/4 inch fat cap. Square up the edges and remove any silver skin from the meat side.",
      time: 30,
      temperature: null
    },
    {
      stepNumber: 2,
      title: "Season the Meat", 
      description: "Mix salt, pepper, and garlic powder. Apply the rub generously to all sides of the brisket. Let it sit at room temperature for 1 hour.",
      time: 60,
      temperature: null
    },
    {
      stepNumber: 3,
      title: "Prepare the Smoker",
      description: "Preheat your smoker to 225°F. Add soaked wood chunks for smoke. Maintain steady temperature and clean smoke.",
      time: 30,
      temperature: 225
    },
    {
      stepNumber: 4,
      title: "Smoke the Brisket",
      description: "Place brisket fat-side up on the smoker. Cook until internal temperature reaches 165°F, about 8-10 hours. Spritz with apple juice every 2 hours after hour 4.",
      time: 480,
      temperature: 165
    },
    {
      stepNumber: 5,
      title: "Wrap and Continue Cooking",
      description: "Wrap brisket in butcher paper or foil. Continue cooking until internal temperature reaches 203°F, about 2-4 more hours.",
      time: 180,
      temperature: 203
    },
    {
      stepNumber: 6,
      title: "Rest and Slice",
      description: "Remove from smoker and rest for at least 1 hour in a cooler or warm oven. Slice against the grain and serve.",
      time: 60,
      temperature: null
    }
  ],
  tags: ["brisket", "texas-style", "competition", "smoking", "beef"],
  isPublished: true
};

async function createTestRecipe() {
  try {
    const response = await fetch('http://localhost:3003/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRecipe)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to create recipe'}`);
    }

    const result = await response.json();
    console.log('✅ Recipe created successfully!');
    console.log('Recipe ID:', result.recipe.id);
    console.log('Recipe URL:', `http://localhost:3003/recipes/${result.recipe.id}`);
    return result;

  } catch (error) {
    console.error('❌ Error creating recipe:', error.message);
    throw error;
  }
}

// Run the test
createTestRecipe();