// Test script to authenticate and create a recipe
async function testRecipeCreationFlow() {
  try {
    console.log('🧪 Testing Recipe Creation Flow...\n');

    // Step 1: Register a test user
    console.log('📝 Step 1: Registering test user...');
    const registerResponse = await fetch('http://localhost:3003/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'pitmaster@bbq.com',
        username: 'pitmaster2024',
        password: 'password123',
        firstName: 'BBQ',
        lastName: 'Master'
      })
    });

    if (registerResponse.ok) {
      console.log('✅ User registered successfully');
    } else if (registerResponse.status === 409) {
      console.log('ℹ️ User already exists, continuing...');
    } else {
      const regError = await registerResponse.json();
      throw new Error(`Registration failed: ${regError.error}`);
    }

    // Step 2: Sign in to get session (NextAuth uses cookies, so this is for demo purposes)
    console.log('\n🔑 Step 2: User authentication required via browser...');
    console.log('Please visit: http://localhost:3003/auth/signin');
    console.log('Email: pitmaster@bbq.com');
    console.log('Password: password123');
    console.log('\nAfter signing in, visit: http://localhost:3003/recipes/create');
    console.log('The recipe creation form should be accessible!');

    // Test recipe data
    const testRecipe = {
      title: "Championship Smoked Brisket",
      description: "A competition-grade Texas-style brisket with a perfect bark and tender, juicy meat. This recipe has won multiple BBQ competitions.",
      prepTime: 60,
      cookTime: 720,
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
          unit: "cup"
        }
      ],
      instructions: [
        {
          stepNumber: 1,
          title: "Trim the Brisket",
          description: "Remove excess fat, leaving about 1/4 inch fat cap. Square up the edges.",
          time: 30
        },
        {
          stepNumber: 2,
          title: "Season and Smoke",
          description: "Apply rub and smoke at 225°F until done.",
          time: 720,
          temperature: 225
        }
      ],
      tags: ["brisket", "texas-style", "smoking", "beef"]
    };

    console.log('\n📋 Recipe data prepared:');
    console.log(`- Title: ${testRecipe.title}`);
    console.log(`- Cook Time: ${testRecipe.cookTime} minutes (${testRecipe.cookTime/60} hours)`);
    console.log(`- Ingredients: ${testRecipe.ingredients.length} items`);
    console.log(`- Instructions: ${testRecipe.instructions.length} steps`);
    console.log(`- Tags: ${testRecipe.tags.join(', ')}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRecipeCreationFlow();