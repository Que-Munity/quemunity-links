import { PrismaClient, Difficulty, CookingMethod, SkillLevel, IngredientCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'pitmaster@quemunity.app',
        username: 'pitmasterjoe',
        passwordHash: hashedPassword,
        profile: {
          create: {
            firstName: 'Joe',
            lastName: 'Pitmaster',
            bio: 'BBQ enthusiast with 20+ years of smoking experience. Specializing in Texas-style brisket.',
            location: 'Austin, TX',
            favoriteWood: 'Oak',
            favoriteProtein: 'Brisket',
            skillLevel: SkillLevel.EXPERT,
            yearsExperience: 25,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarahbbq@quemunity.app',
        username: 'sarahbbq',
        passwordHash: hashedPassword,
        profile: {
          create: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            bio: 'Carolina BBQ lover and competition pitmaster. Known for my pulled pork.',
            location: 'Charlotte, NC',
            favoriteWood: 'Hickory',
            favoriteProtein: 'Pork Shoulder',
            skillLevel: SkillLevel.ADVANCED,
            yearsExperience: 15,
          },
        },
      },
    }),
  ]);

  // Create ingredients
  const ingredients = await Promise.all([
    // Proteins
    prisma.ingredient.create({
      data: {
        name: 'Beef Brisket',
        category: IngredientCategory.PROTEIN,
        caloriesPerGram: 2.5,
        proteinPerGram: 0.26,
        fatPerGram: 0.20,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Pork Shoulder',
        category: IngredientCategory.PROTEIN,
        caloriesPerGram: 2.0,
        proteinPerGram: 0.20,
        fatPerGram: 0.15,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Baby Back Ribs',
        category: IngredientCategory.PROTEIN,
        caloriesPerGram: 2.8,
        proteinPerGram: 0.22,
        fatPerGram: 0.24,
      },
    }),
    // Spices
    prisma.ingredient.create({
      data: {
        name: 'Kosher Salt',
        category: IngredientCategory.SPICES,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Black Pepper',
        category: IngredientCategory.SPICES,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Garlic Powder',
        category: IngredientCategory.SPICES,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Paprika',
        category: IngredientCategory.SPICES,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'Brown Sugar',
        category: IngredientCategory.SWEETENERS,
      },
    }),
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'brisket' } }),
    prisma.tag.create({ data: { name: 'texas-style' } }),
    prisma.tag.create({ data: { name: 'low-and-slow' } }),
    prisma.tag.create({ data: { name: 'beef' } }),
    prisma.tag.create({ data: { name: 'pork' } }),
    prisma.tag.create({ data: { name: 'ribs' } }),
    prisma.tag.create({ data: { name: 'pulled-pork' } }),
    prisma.tag.create({ data: { name: 'carolina-style' } }),
  ]);

  // Create sample recipes
  const brisketRecipe = await prisma.recipe.create({
    data: {
      title: 'Texas-Style Smoked Brisket',
      description: 'The holy grail of BBQ - a perfectly smoked brisket with a beautiful bark and tender, juicy interior. This recipe follows traditional Texas methods for authentic results.',
      slug: 'texas-style-smoked-brisket',
      prepTime: 30,
      cookTime: 780, // 13 hours
      totalTime: 810,
      servings: 8,
      difficulty: Difficulty.EXPERT,
      cookingMethod: CookingMethod.SMOKING,
      smokingWood: 'Oak, Hickory',
      smokerTemp: 225,
      internalTemp: 203,
      authorId: users[0].id,
      isPublished: true,
      isDraft: false,
      
      // Add ingredients
      ingredients: {
        create: [
          {
            amount: 12,
            unit: 'lbs',
            order: 0,
            ingredient: { connect: { name: 'Beef Brisket' } },
          },
          {
            amount: 0.5,
            unit: 'cup',
            order: 1,
            section: 'Texas Rub',
            ingredient: { connect: { name: 'Kosher Salt' } },
          },
          {
            amount: 0.5,
            unit: 'cup',
            order: 2,
            section: 'Texas Rub',
            ingredient: { connect: { name: 'Black Pepper' } },
          },
          {
            amount: 2,
            unit: 'tbsp',
            order: 3,
            section: 'Texas Rub',
            ingredient: { connect: { name: 'Garlic Powder' } },
          },
        ],
      },
      
      // Add instructions
      instructions: {
        create: [
          {
            stepNumber: 1,
            title: 'Prepare the Brisket',
            description: 'Trim the fat cap to about 1/4 inch thickness. Remove any hard fat and silver skin.',
            time: 20,
          },
          {
            stepNumber: 2,
            title: 'Apply the Rub',
            description: 'Mix all rub ingredients and apply generously to all surfaces. Let rest for 1 hour.',
            time: 60,
          },
          {
            stepNumber: 3,
            title: 'Prepare the Smoker',
            description: 'Set up your smoker for indirect cooking at 225°F. Add oak and hickory wood.',
            temperature: 225,
          },
          {
            stepNumber: 4,
            title: 'Start Smoking',
            description: 'Place brisket fat-side down. Smoke until internal temp reaches 165°F.',
            time: 480, // 8 hours
            temperature: 165,
          },
          {
            stepNumber: 5,
            title: 'Wrap and Continue',
            description: 'Wrap in butcher paper and continue smoking until internal temp reaches 203°F.',
            time: 300, // 5 hours
            temperature: 203,
          },
          {
            stepNumber: 6,
            title: 'Rest and Slice',
            description: 'Rest for at least 1 hour, then slice against the grain.',
            time: 60,
          },
        ],
      },
      
      // Add nutrition
      nutrition: {
        create: {
          calories: 420,
          protein: 35,
          carbohydrates: 2,
          fat: 28,
          sodium: 850,
        },
      },
      
      // Add tags
      tags: {
        create: [
          { tag: { connect: { name: 'brisket' } } },
          { tag: { connect: { name: 'texas-style' } } },
          { tag: { connect: { name: 'low-and-slow' } } },
          { tag: { connect: { name: 'beef' } } },
        ],
      },
    },
  });

  const pulledPorkRecipe = await prisma.recipe.create({
    data: {
      title: 'Carolina Pulled Pork',
      description: 'Traditional Eastern Carolina pulled pork with tangy vinegar-based sauce. Tender, juicy, and full of flavor.',
      slug: 'carolina-pulled-pork',
      prepTime: 20,
      cookTime: 600, // 10 hours
      totalTime: 620,
      servings: 8,
      difficulty: Difficulty.MEDIUM,
      cookingMethod: CookingMethod.SMOKING,
      smokingWood: 'Hickory, Apple',
      smokerTemp: 225,
      internalTemp: 195,
      authorId: users[1].id,
      isPublished: true,
      isDraft: false,
      
      ingredients: {
        create: [
          {
            amount: 8,
            unit: 'lbs',
            order: 0,
            ingredient: { connect: { name: 'Pork Shoulder' } },
          },
          {
            amount: 0.25,
            unit: 'cup',
            order: 1,
            section: 'Pork Rub',
            ingredient: { connect: { name: 'Brown Sugar' } },
          },
          {
            amount: 2,
            unit: 'tbsp',
            order: 2,
            section: 'Pork Rub',
            ingredient: { connect: { name: 'Paprika' } },
          },
        ],
      },
      
      instructions: {
        create: [
          {
            stepNumber: 1,
            title: 'Season the Pork',
            description: 'Apply rub generously and let sit overnight in refrigerator.',
            time: 15,
          },
          {
            stepNumber: 2,
            title: 'Set Up Smoker',
            description: 'Preheat smoker to 225°F with hickory and apple wood.',
            temperature: 225,
          },
          {
            stepNumber: 3,
            title: 'Smoke the Pork',
            description: 'Smoke until internal temperature reaches 195°F.',
            time: 600,
            temperature: 195,
          },
          {
            stepNumber: 4,
            title: 'Rest and Shred',
            description: 'Rest for 30 minutes, then shred with claws or forks.',
            time: 30,
          },
        ],
      },
      
      nutrition: {
        create: {
          calories: 380,
          protein: 32,
          carbohydrates: 8,
          fat: 22,
          sodium: 720,
        },
      },
      
      tags: {
        create: [
          { tag: { connect: { name: 'pork' } } },
          { tag: { connect: { name: 'pulled-pork' } } },
          { tag: { connect: { name: 'carolina-style' } } },
        ],
      },
    },
  });

  // Add some reviews and ratings
  await Promise.all([
    prisma.review.create({
      data: {
        userId: users[1].id,
        recipeId: brisketRecipe.id,
        title: 'Amazing Brisket!',
        content: 'This recipe is absolutely incredible. The bark was perfect and the meat was so tender. Took exactly 13 hours as predicted.',
        rating: 5,
        wouldMakeAgain: true,
      },
    }),
    prisma.rating.create({
      data: {
        userId: users[1].id,
        recipeId: brisketRecipe.id,
        value: 5,
      },
    }),
    prisma.review.create({
      data: {
        userId: users[0].id,
        recipeId: pulledPorkRecipe.id,
        title: 'Authentic Carolina Flavor',
        content: 'Sarah nailed the traditional Carolina style. The vinegar sauce really makes this special.',
        rating: 5,
        wouldMakeAgain: true,
      },
    }),
    prisma.rating.create({
      data: {
        userId: users[0].id,
        recipeId: pulledPorkRecipe.id,
        value: 5,
      },
    }),
  ]);

  // Add some favorites
  await Promise.all([
    prisma.favorite.create({
      data: {
        userId: users[1].id,
        recipeId: brisketRecipe.id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: users[0].id,
        recipeId: pulledPorkRecipe.id,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${ingredients.length} ingredients`);
  console.log(`Created ${tags.length} tags`);
  console.log('Created 2 sample recipes with reviews and ratings');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });