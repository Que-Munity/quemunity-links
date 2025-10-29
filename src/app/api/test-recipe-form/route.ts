import { NextResponse } from 'next/server';

export async function GET() {
  // Test data to simulate a recipe creation
  const testRecipeData = {
    title: "Test BBQ Brisket Recipe",
    description: "A delicious smoked brisket recipe",
    prepTime: 30,
    cookTime: 720, // 12 hours
    servings: 8,
    difficulty: "MEDIUM",
    cookingMethod: "PELLET_SMOKER",
    smokingWood: "Oak and Hickory",
    smokerTemp: 225,
    internalTemp: 203,
    sauce: "Kansas City Style",
    seasoningRub: "Texas BBQ Rub",
    ingredients: [
      {
        name: "Beef Brisket",
        amount: "12",
        unit: "lbs",
        notes: "Trimmed fat cap to 1/4 inch"
      },
      {
        name: "BBQ Rub",
        amount: "1/2",
        unit: "cup",
        notes: "Apply 12 hours before cooking"
      }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Prepare the brisket",
        description: "Trim excess fat and apply rub generously",
        time: 30,
        temperature: null
      },
      {
        stepNumber: 2,
        title: "Start the smoker",
        description: "Preheat smoker to 225°F with oak and hickory wood",
        time: 60,
        temperature: 225
      }
    ],
    tags: ["brisket", "texas", "bbq", "smoked"]
  };

  return NextResponse.json({
    message: "Recipe form test data",
    testData: testRecipeData,
    formFields: {
      newFields: ["sauce", "seasoningRub"],
      improvedLayout: "ingredient fields now have better spacing and visibility"
    }
  });
}