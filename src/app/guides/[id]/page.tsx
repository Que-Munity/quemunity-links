'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, BookOpen, Thermometer, TreePine, ThumbsUp, ThumbsDown, MessageSquare, Star, Heart, Share2 } from 'lucide-react';

// This would normally come from a database or CMS
const guides = {
  1: {
    id: 1,
    title: "BBQ Smoking 101: Complete Beginner's Guide",
    description: "Master the fundamentals of low and slow BBQ smoking with this comprehensive starter guide covering equipment, techniques, and your first cook.",
    author: "Mike 'Pitmaster' Johnson",
    readTime: "20 min read",
    difficulty: "Beginner",
    category: "Fundamentals",
    tags: ["smoking", "basics", "temperature", "equipment"],
    views: 25847,
    lastUpdated: "2025-10-01",
    content: [
      {
        type: 'section',
        title: 'Introduction to BBQ Smoking',
        content: 'BBQ smoking is the art of cooking meat low and slow with wood smoke to create incredible flavor and tenderness. This ancient cooking method transforms tough, cheap cuts into restaurant-quality meals.\n\nThe magic happens at temperatures between 200-275°F over several hours. The low heat breaks down connective tissues while the smoke infuses deep flavor throughout the meat.\n\n**Why Smoke?**\n• Creates complex, rich flavors impossible with other methods\n• Tenderizes tough cuts like brisket and pork shoulder\n• Develops beautiful bark (crusty exterior)\n• Perfect for entertaining large groups'
      },
      {
        type: 'section',
        title: 'Choosing Your First Smoker',
        content: '**Offset Smokers ($200-2000+)**\nTraditional stick burners with separate fireboxes. Require constant attention but produce authentic BBQ flavor.\n\n**Kamado Grills ($300-1500)**\nCeramic egg-shaped grills with excellent heat retention. Great for beginners, can also grill at high temps.\n\n**Electric Smokers ($150-800)**\nSet temperature and walk away. Perfect for apartments or beginners wanting consistency.\n\n**Pellet Smokers ($400-2500)**\nComputer-controlled wood pellet feeders. Combine convenience with real wood flavor.\n\n**Weber Kettles ($100-400)**\nAdd wood chunks to charcoal for affordable smoking. Great starter option most people already own.'
      },
      {
        type: 'tip',
        title: 'Start Simple',
        content: 'Don\'t break the bank on your first smoker. A basic Weber kettle with the snake method can produce amazing results while you learn the fundamentals. Upgrade once you\'re hooked!'
      },
      {
        type: 'section',
        title: 'Essential Equipment',
        content: '**Must-Have Tools:**\n• Digital thermometer with wireless probes (most important!)\n• Chimney starter for charcoal\n• Heat-resistant gloves\n• Spray bottle for spritzing\n• Aluminum foil and butcher paper\n• Long-handled spatula and tongs\n• Headlamp for night cooking\n• Cooler for resting meat\n\n**Nice-to-Have Items:**\n• Instant-read thermometer\n• Grill brush\n• Drip pans\n• Rib rack\n• Meat claws for pulling pork'
      },
      {
        type: 'section',
        title: 'Wood Selection Guide',
        content: '**Fruit Woods (Mild)**\n• Apple: Sweet, mild smoke perfect for pork and poultry\n• Cherry: Beautiful red color, mild flavor works with everything\n• Peach/Pear: Delicate, sweet smoke for fish and chicken\n\n**Nut Woods (Medium)**\n• Hickory: Classic BBQ flavor, especially great with pork\n• Pecan: Similar to hickory but milder, excellent all-purpose\n\n**Hardwoods (Strong)**\n• Oak: Clean burning, mild flavor, great base wood\n• Mesquite: Intense flavor, traditional for Texas beef\n\n**Pro Tips:**\n• Soak chunks 30 minutes before use\n• Start with milder woods like apple or cherry\n• Mix woods for complex flavor profiles\n• Avoid softwoods (pine, cedar) - they\'re toxic'
      },
      {
        type: 'section',
        title: 'Temperature Control Mastery',
        content: '**Target Temperatures:**\n• Brisket: 225-250°F for 12-16 hours\n• Pork Shoulder: 225-250°F for 8-12 hours\n• Ribs: 225-275°F for 4-6 hours\n• Chicken: 275-325°F for 2-3 hours\n\n**The Stall Explained:**\nAround 150-170°F internal temp, meat stops rising in temperature for hours. This is evaporation cooling as moisture leaves the surface. Be patient or use the "Texas Crutch" - wrap in foil or butcher paper.\n\n**Managing Your Fire:**\n• Use vents to control airflow and temperature\n• Open vents = hotter, closed vents = cooler\n• Add fuel before temperature drops, not after\n• Learn your smoker\'s personality through practice'
      },
      {
        type: 'tip',
        title: 'Temperature is King',
        content: 'Internal temperature is more important than time. A 203°F pork shoulder that took 18 hours will be more tender than a 190°F shoulder that "finished" in 12 hours. Trust the thermometer!'
      },
      {
        type: 'section',
        title: 'Your First Cook: Pork Shoulder',
        content: '**Why Pork Shoulder First?**\nPork shoulder (Boston butt) is incredibly forgiving. It\'s hard to overcook and has enough fat to stay moist even if you make mistakes.\n\n**Step-by-Step Process:**\n1. **Prep (Night Before):** Trim excess fat, season with salt, pepper, brown sugar, and paprika\n2. **Setup:** Preheat smoker to 225°F, add wood chunks\n3. **Cook:** Place fat-side up, insert probe thermometer\n4. **Monitor:** Maintain 225-250°F, add wood for first 4 hours\n5. **Stall:** Around hour 6-8, internal temp may plateau at 165°F - be patient\n6. **Finish:** Cook until probe slides in like butter (200-205°F internal)\n7. **Rest:** Wrap in towels, rest in cooler for 1-2 hours\n8. **Pull:** Shred with forks or meat claws, mix in any drippings\n\n**Timeline for 8lb Shoulder:**\n• Total time: 12-16 hours\n• Plan to start very early morning\n• Always cook to temperature, not time'
      }
    ]
  },
  2: {
    id: 2,
    title: "Perfect Brisket: Texas Style Mastery",
    description: "Master the holy grail of BBQ with this comprehensive guide to smoking championship-quality brisket using traditional Texas techniques.",
    author: "Aaron Franklin",
    readTime: "25 min read",
    difficulty: "Advanced",
    category: "Beef",
    tags: ["brisket", "texas", "beef", "advanced"],
    views: 18592,
    lastUpdated: "2025-09-28",
    content: [
      {
        type: 'section',
        title: 'Selecting Your Brisket',
        content: '**What to Look For:**\n• Choice or Prime grade for best marbling\n• 12-16 lbs for optimal cooking (packer brisket)\n• Flexible flat end - should bend easily\n• Thick, even fat cap (¼ inch when trimmed)\n• Deep red color, avoid gray or brown meat\n\n**Anatomy of a Brisket:**\n• **Point**: Fattier, more marbled end - becomes burnt ends\n• **Flat**: Leaner section - slices for sandwiches\n• **Fat Cap**: Protects meat, renders during cooking\n• **Grain Direction**: Changes between point and flat'
      },
      {
        type: 'section',
        title: 'Trimming Like a Pro',
        content: '**Trimming Steps:**\n1. Remove silver skin and excess fat\n2. Leave ¼ inch fat cap for protection\n3. Square up edges for even cooking\n4. Score fat cap in crosshatch pattern\n5. Round off sharp corners\n\n**Tools Needed:**\n• Sharp boning knife\n• Cutting board\n• Paper towels\n\n**Pro Tip:** Don\'t over-trim your first brisket. Fat is forgiving and protects the meat.'
      },
      {
        type: 'section',
        title: 'The Perfect Rub',
        content: '**Classic Texas Rub (50/50):**\n• 1 cup coarse black pepper\n• 1 cup kosher salt\n• Optional: 2 tbsp garlic powder\n\n**Competition Style Rub:**\n• ½ cup kosher salt\n• ½ cup coarse black pepper\n• ¼ cup brown sugar\n• 2 tbsp paprika\n• 2 tbsp garlic powder\n• 1 tbsp onion powder\n• 1 tbsp chili powder\n• 1 tsp cayenne\n\n**Application:**\n• Season 2-24 hours before cooking\n• Apply generously - brisket is a big piece of meat'
      },
      {
        type: 'tip',
        title: 'The Probe Test',
        content: 'More important than temperature - when a thermometer probe slides into the thickest part with no resistance, like sliding into soft butter, it\'s done. This is the most reliable doneness test.'
      },
      {
        type: 'section',
        title: 'The 12-Hour Journey',
        content: '**Hour 1-3: The Setup**\n• Preheat smoker to 250°F\n• Fat cap up or down? (Personal preference - both work)\n• Add wood chunks every hour for first 4 hours\n• Don\'t open the lid - "If you\'re looking, you\'re not cooking"\n\n**Hour 4-8: Building the Bark**\n• Beautiful dark bark should be forming\n• Internal temp climbing toward 150-170°F\n• Spray with apple juice/beef broth every 2 hours (optional)\n• Maintain steady 225-250°F smoker temperature\n\n**Hour 8-12: The Stall and Push**\n• Meat may stall at 150-170°F for hours - this is normal\n• Option 1: Wait it out (traditional)\n• Option 2: Texas Crutch - wrap in butcher paper at 165°F\n• Cook until probe slides through like butter (200-205°F internal)'
      },
      {
        type: 'section',
        title: 'Resting and Slicing',
        content: '**Proper Resting:**\n• Rest for minimum 1 hour, preferably 2-4 hours\n• Wrap in butcher paper, then towels, hold in cooler\n• Internal temp should drop to 140-150°F before slicing\n\n**Slicing Technique:**\n• Always slice against the grain\n• Grain direction changes between flat and point\n• Flat: slice ¼ inch thick for sandwiches\n• Point: cube for burnt ends or slice thicker\n• Use a sharp knife - dull blades shred the meat\n\n**Serving:**\n• Serve immediately after slicing\n• Offer sauce on the side - good brisket doesn\'t need it\n• Save trimmings for beans or chopped beef'
      }
    ]
  },
  3: {
    id: 3,
    title: "Competition-Style BBQ Ribs: The 3-2-1 Method",
    description: "Learn the famous 3-2-1 method and competition techniques for perfect fall-off-the-bone ribs that win contests.",
    author: "Melissa Cookston",
    readTime: "18 min read",
    difficulty: "Intermediate",
    category: "Pork",
    tags: ["ribs", "pork", "3-2-1-method", "competition"],
    views: 14283,
    lastUpdated: "2025-09-25",
    content: [
      {
        type: 'section',
        title: 'Types of Ribs',
        content: '**Baby Back Ribs:**\n• Leaner, more tender, cook faster (4-5 hours)\n• Curved shape from upper part of pig\n• More expensive but very popular\n• Less forgiving if overcooked\n\n**St. Louis Style Ribs:**\n• Cut from spare ribs, squared off ends\n• More fat and connective tissue = more flavor\n• Rectangular shape, easier to cook evenly\n• More forgiving for beginners\n\n**Spare Ribs (Whole):**\n• Largest, most flavorful, longest cook time\n• Include rib tips and cartilage\n• Irregular shape makes even cooking challenging\n• Best value for money'
      },
      {
        type: 'section',
        title: 'Preparation Essentials',
        content: '**Removing the Membrane:**\n1. Flip ribs bone-side up\n2. Use a butter knife to lift membrane at one end\n3. Grab with paper towel and pull off in one piece\n4. This allows better seasoning penetration\n\n**Trimming:**\n• Remove excess fat and loose meat\n• Square up ends for even cooking\n• Don\'t over-trim - fat adds flavor'
      },
      {
        type: 'section',
        title: 'The Famous 3-2-1 Method',
        content: '**3 Hours: Smoke Uncovered**\n• Season ribs with your favorite rub\n• Smoke at 225°F, meat side up\n• Add wood chunks for first 2 hours\n• Spritz with apple juice hourly (optional)\n• Look for good color development\n\n**2 Hours: Wrapped**\n• Wrap ribs in foil with butter, brown sugar, honey\n• This steams the ribs, making them tender\n• Some prefer butcher paper for less steaming\n• Continue at 225°F\n\n**1 Hour: Unwrapped and Sauced**\n• Remove from foil, apply BBQ sauce\n• Return to smoker to set the glaze\n• Sauce every 15-20 minutes\n• Look for slight pullback from bones'
      },
      {
        type: 'tip',
        title: 'Doneness Tests',
        content: 'Bend Test: Pick up ribs with tongs - they should bend 90° and show slight cracking in the meat surface. Toothpick Test: Should slide between bones with little resistance.'
      },
      {
        type: 'section',
        title: 'Competition Rub Recipe',
        content: '**Award-Winning Rib Rub:**\n• ¼ cup brown sugar\n• 2 tbsp paprika\n• 1 tbsp each: salt, black pepper, chili powder\n• 1 tsp each: garlic powder, onion powder, cayenne\n• ½ tsp dry mustard\n\n**Application:**\n• Apply rub 2-4 hours before cooking\n• Use mustard as binder for better adhesion\n• Be generous - ribs can handle heavy seasoning'
      },
      {
        type: 'section',
        title: 'Regional Sauce Styles',
        content: '**Kansas City Style:**\n• Thick, molasses-based\n• Sweet with tangy finish\n• Apply last hour of cooking\n\n**Carolina Style:**\n• Vinegar-based, thin consistency\n• Tangy with heat\n• Can use as mop sauce throughout\n\n**Competition Glaze:**\n• Mix BBQ sauce with honey and butter\n• Apply in thin layers\n• Builds beautiful, glossy finish'
      }
    ]
  },
  4: {
    id: 4,
    title: "Perfect Pulled Pork: Foolproof Method",
    description: "Master the most beginner-friendly BBQ cut with this step-by-step guide to tender, juicy pulled pork that falls apart perfectly.",
    author: "Big Bob Gibson",
    readTime: "15 min read",
    difficulty: "Beginner",
    category: "Pork",
    tags: ["pork-shoulder", "pulled-pork", "beginner-friendly"],
    views: 22195,
    lastUpdated: "2025-09-20",
    content: [
      {
        type: 'section',
        title: 'Choosing Your Pork Shoulder',
        content: '**Boston Butt vs Picnic Roast:**\n• **Boston Butt**: Upper shoulder, more marbling, easier to cook\n• **Picnic Roast**: Lower shoulder, leaner, skin-on, tougher cut\n• Boston Butt is preferred for pulled pork\n\n**Sizing Guide:**\n• 8-10 lbs feeds 16-20 people\n• 5-6 lbs perfect for family dinner\n• Figure ½ lb raw weight per person\n• Bone-in has more flavor, boneless cooks faster'
      },
      {
        type: 'section',
        title: 'Seasoning and Prep',
        content: '**Classic Pulled Pork Rub:**\n• ¼ cup brown sugar\n• 2 tbsp paprika\n• 2 tbsp salt\n• 1 tbsp black pepper\n• 1 tbsp chili powder\n• 1 tsp garlic powder\n• 1 tsp onion powder\n• 1 tsp dry mustard\n• ½ tsp cayenne\n\n**Preparation Steps:**\n1. Trim excess fat, leave ¼ inch\n2. Score fat cap in crosshatch pattern\n3. Apply mustard as binder (optional)\n4. Coat generously with rub\n5. Refrigerate 2-24 hours'
      },
      {
        type: 'tip',
        title: 'Why Pork Shoulder is Forgiving',
        content: 'Pork shoulder has lots of connective tissue and fat. This means it\'s almost impossible to overcook - the extra time just makes it more tender. Perfect for beginners!'
      },
      {
        type: 'section',
        title: 'The Smoking Process',
        content: '**Setup:**\n• Target temperature: 225-250°F\n• Fat cap up for protection\n• Insert probe in thickest part\n• Plan 1.5 hours per pound\n\n**Timeline for 8lb Shoulder:**\n• Hours 0-4: Building bark, add wood\n• Hours 4-8: Bark development, steady temp\n• Hours 8-12: The stall period (be patient!)\n• Hours 12-16: Final push to 203°F internal\n\n**The Stall:**\n• Happens around 160-170°F internal\n• Can last 2-4 hours\n• Wrap in butcher paper if impatient\n• Don\'t raise temperature to "speed up"'
      },
      {
        type: 'section',
        title: 'Pulling and Serving',
        content: '**Doneness Signs:**\n• Internal temperature 195-205°F\n• Probe slides in like butter\n• Bone wiggles loose easily\n• Meat pulls apart with forks\n\n**Pulling Technique:**\n• Remove bone (slides right out)\n• Discard large fat pieces\n• Pull with forks or bear claws\n• Don\'t shred too fine - chunky is better\n• Mix bark pieces with interior meat\n\n**Serving Ideas:**\n• Classic sandwiches with coleslaw\n• Tacos with pickled onions\n• Mac and cheese topping\n• BBQ nachos\n• Breakfast hash with eggs'
      }
    ]
  },
  5: {
    id: 5,
    title: "Wood Selection Guide: Matching Flavors to Meat",
    description: "Comprehensive guide to different wood types and how they affect BBQ flavor. Learn to pair woods with meats for optimal taste.",
    author: "Wood Whisperer Sam",
    readTime: "12 min read",
    difficulty: "Beginner",
    category: "Wood & Smoke",
    tags: ["wood", "flavor", "hickory", "apple", "oak", "mesquite"],
    views: 16742,
    lastUpdated: "2025-09-15",
    content: [
      {
        type: 'section',
        title: 'Understanding Wood Smoke Flavors',
        content: 'The type of wood you choose is one of the most important decisions in BBQ. Different woods impart dramatically different flavors, from mild and sweet to bold and intense. Understanding these flavor profiles will help you create the perfect complement to your meat.\n\n**Flavor Categories:**\n• **Mild**: Subtle smoke that enhances without overpowering\n• **Medium**: Balanced flavor that adds character\n• **Strong**: Bold smoke that makes a statement\n• **Regional**: Traditional pairings from BBQ regions\n\n**General Rule:** Start mild and work your way up to stronger woods as you develop your palate.'
      },
      {
        type: 'section',
        title: 'Fruit Woods: Sweet and Mild',
        content: '**Apple Wood**\n• Flavor: Sweet, mild, slightly fruity\n• Best for: Pork, chicken, turkey, fish\n• Burn characteristics: Clean, steady burn\n• Color: Produces beautiful golden mahogany color\n\n**Cherry Wood**\n• Flavor: Mild, slightly sweet with subtle tartness\n• Best for: All meats, especially pork and poultry\n• Special feature: Creates gorgeous reddish color\n• Perfect for: Competition BBQ presentation\n\n**Peach/Pear Wood**\n• Flavor: Very mild, delicate sweetness\n• Best for: Fish, chicken, light pork cuts\n• Characteristics: Burns clean, minimal smoke output\n• Availability: Less common but worth seeking out'
      },
      {
        type: 'tip',
        title: 'Fruit Wood Pro Tip',
        content: 'Fruit woods are perfect for beginners because they\'re almost impossible to over-smoke with. You can use them throughout the entire cook without worrying about bitter flavors.'
      },
      {
        type: 'section',
        title: 'Nut Woods: The BBQ Standards',
        content: '**Hickory Wood**\n• Flavor: Strong, bacon-like, classic BBQ taste\n• Best for: Pork (especially ribs), beef, game\n• Characteristics: The most popular BBQ wood\n• Warning: Can become bitter if over-used\n\n**Pecan Wood**\n• Flavor: Similar to hickory but milder and sweeter\n• Best for: All meats, excellent all-purpose wood\n• Characteristics: Burns clean, less chance of over-smoking\n• Regional: Traditional in Southern BBQ\n\n**Walnut Wood**\n• Flavor: Strong, earthy, can be bitter\n• Best for: Red meat, use sparingly\n• Characteristics: Very intense, mix with milder woods\n• Tip: Not recommended for beginners'
      },
      {
        type: 'section',
        title: 'Hardwoods: Clean and Reliable',
        content: '**Oak Wood**\n• Flavor: Mild, clean, slightly nutty\n• Best for: All meats, excellent base wood\n• Characteristics: Long, steady burn\n• Use: Great for mixing with other woods\n\n**Maple Wood**\n• Flavor: Mild, slightly sweet\n• Best for: Poultry, pork, vegetables\n• Characteristics: Produces light, pleasant smoke\n• Regional: Popular in Northeast BBQ\n\n**Ash Wood**\n• Flavor: Mild, clean, neutral\n• Best for: Fish, delicate meats\n• Characteristics: Burns hot and clean\n• Availability: Less common but excellent'
      },
      {
        type: 'section',
        title: 'Strong Woods: Use with Caution',
        content: '**Mesquite Wood**\n• Flavor: Very strong, earthy, intense\n• Best for: Beef, especially in short cooks\n• Regional: Traditional Texas wood\n• Warning: Can overpower in long cooks\n\n**Cedar Wood**\n• Use: NEVER use cedar for smoking\n• Reason: Toxic compounds, resinous\n• Alternative: Use cedar planks for grilling fish only\n• Safety: Stick to hardwoods for smoking\n\n**Pine/Softwoods**\n• Use: NEVER use for smoking\n• Reason: High resin content is toxic\n• Safety: Only use seasoned hardwoods\n• Identification: If it has needles or cones, don\'t use it'
      },
      {
        type: 'tip',
        title: 'Wood Pairing Guide',
        content: '**Perfect Pairings:**\n• Brisket: Oak + hickory or mesquite (Texas style)\n• Pork shoulder: Apple + hickory or cherry + pecan\n• Ribs: Cherry + hickory or apple + oak\n• Chicken: Apple or cherry (mild and sweet)\n• Fish: Cedar plank, apple, or alder'
      },
      {
        type: 'section',
        title: 'Wood Preparation and Usage',
        content: '**Preparation:**\n• Soak chunks 30-60 minutes before use\n• Don\'t soak chips - they burn too fast anyway\n• Use chunks 2-4 inches for best results\n• Avoid green (unseasoned) wood\n\n**Usage Guidelines:**\n• Add wood only for first 3-4 hours of cooking\n• Thin blue smoke is good, thick white smoke is bad\n• If you can\'t see through the smoke, it\'s too much\n• Less is more - you can always add, can\'t subtract\n\n**Storage:**\n• Keep wood dry and well-ventilated\n• Avoid plastic bags - promotes mold\n• Stack with air gaps for proper drying\n• Seasoned wood should feel light and sound hollow'
      }
    ]
  },
  6: {
    id: 6,
    title: "BBQ Temperature Guide: When Is It Done?",
    description: "Master internal temperatures for perfect doneness. Complete charts and techniques for brisket, pork, ribs, chicken, and more.",
    author: "Temp Master Marcus",
    readTime: "10 min read",
    difficulty: "Intermediate",
    category: "Temperature",
    tags: ["temperature", "doneness", "safety", "thermometer"],
    views: 19384,
    lastUpdated: "2025-09-12",
    content: [
      {
        type: 'section',
        title: 'Why Temperature Matters More Than Time',
        content: 'In BBQ, internal temperature is the ultimate judge of doneness. Two identical briskets can take vastly different times to cook depending on factors like:\n\n• Actual smoker temperature variations\n• Meat density and moisture content\n• Fat distribution and marbling\n• Weather conditions (wind, humidity, outside temp)\n• Individual smoker characteristics\n\n**The Golden Rule:** Cook to temperature, not time. A properly cooked piece of meat at the right internal temperature will always be better than one that "finished" early but isn\'t actually done.'
      },
      {
        type: 'section',
        title: 'Essential Thermometer Types',
        content: '**Instant-Read Thermometers:**\n• Best for: Quick checks, multiple pieces\n• Accuracy: Usually ±1-2°F\n• Speed: 2-10 second readings\n• Tip: Don\'t leave in smoker, heat will damage it\n\n**Probe Thermometers (Wired)**\n• Best for: Long cooks, continuous monitoring\n• Features: High-temperature cables, remote displays\n• Advantage: Monitor without opening smoker\n• Popular brands: ThermoWorks, Weber, Maverick\n\n**Wireless Probe Thermometers**\n• Best for: Overnight cooks, multiple probes\n• Features: Smartphone apps, alerts, multiple meat monitoring\n• Range: Usually 100-300 feet\n• Investment: Worth it for serious BBQ enthusiasts'
      },
      {
        type: 'tip',
        title: 'Thermometer Accuracy',
        content: 'Test your thermometer accuracy in ice water (should read 32°F) and boiling water (212°F at sea level). If it\'s off by more than 2°F consistently, factor that into your readings or replace it.'
      },
      {
        type: 'section',
        title: 'Beef Temperature Guide',
        content: '**Brisket:**\n• Target: 200-205°F in thickest part of flat\n• Probe test: Should slide in like butter\n• Note: Some briskets are done at 195°F, others need 210°F\n• Rest: Minimum 1 hour, preferably 2-4 hours\n\n**Beef Ribs (Short Ribs):**\n• Target: 200-205°F\n• Test: Bone should wiggle loose\n• Time: Usually 6-8 hours at 250°F\n• Rest: 30-60 minutes\n\n**Tri-Tip:**\n• Medium-rare: 130-135°F\n• Medium: 135-145°F\n• Note: This cut is best not overcooked\n• Rest: 10-15 minutes\n\n**Chuck Roast (Poor Man\'s Brisket):**\n• Target: 200-205°F\n• Test: Fork tender, pulls apart easily\n• Time: Usually 8-10 hours\n• Rest: 1-2 hours'
      },
      {
        type: 'section',
        title: 'Pork Temperature Guide',
        content: '**Pork Shoulder/Boston Butt:**\n• Target: 195-205°F\n• Test: Bone slides out easily, meat pulls apart\n• Sweet spot: Most tender around 203°F\n• Rest: 1-4 hours (can hold longer)\n\n**Pork Ribs (Spare/St. Louis):**\n• Target: 195-203°F\n• Tests: Bend test (crack when bent 90°), toothpick test\n• Note: Competition ribs often pulled earlier (190°F)\n• Rest: 30 minutes\n\n**Baby Back Ribs:**\n• Target: 190-200°F\n• Note: Leaner, cook to lower temp than spare ribs\n• Test: Meat pulls back from bones ¼ inch\n• Rest: 15-30 minutes\n\n**Pork Tenderloin:**\n• Target: 145°F (USDA safe)\n• Note: Can be slightly pink at this temperature\n• Rest: 10 minutes\n• Speed: Cooks quickly, watch carefully'
      },
      {
        type: 'section',
        title: 'Poultry Temperature Guide',
        content: '**Whole Chicken:**\n• Breast: 165°F\n• Thigh: 175-180°F (dark meat benefits from higher temp)\n• Tip: Probe thigh near bone for most accurate reading\n• Rest: 10-15 minutes\n\n**Chicken Thighs (Bone-in):**\n• Target: 175-180°F\n• Why higher: Breaks down more collagen, more tender\n• Test: Juices run clear, no pink near bone\n• Time: Usually 1.5-2 hours at 275°F\n\n**Turkey (Whole):**\n• Breast: 165°F\n• Thigh: 175°F\n• Tip: Use multiple probes for large birds\n• Spatchcock option: Cooks more evenly\n\n**Chicken Wings:**\n• Target: 175-180°F\n• Crispy skin: Finish at higher heat (350°F+)\n• Time: 1-1.5 hours total\n• Test: Drumette bone twists easily'
      },
      {
        type: 'tip',
        title: 'Carryover Cooking',
        content: 'Remember carryover cooking! Large cuts like brisket and pork shoulder can rise 5-10°F after removing from heat. For smaller cuts, pull them 3-5°F before target temperature.'
      },
      {
        type: 'section',
        title: 'Food Safety Temperatures',
        content: '**USDA Minimum Safe Temperatures:**\n• Beef/Pork/Lamb: 145°F + 3 min rest\n• Ground meats: 160°F\n• Poultry (all parts): 165°F\n• Fish: 145°F\n\n**BBQ Reality:**\n• We cook most BBQ well above minimums for tenderness\n• Brisket at 203°F is much safer than 145°F minimum\n• Long, slow cooking eliminates pathogens effectively\n• When in doubt, use a thermometer\n\n**Danger Zone:**\n• 40-140°F is where bacteria multiply rapidly\n• Don\'t leave meat in this range for more than 2 hours\n• Hot holding should be above 140°F\n• Reheat leftovers to 165°F'
      }
    ]
  },
  7: {
    id: 7,
    title: "Building Championship BBQ Rubs",
    description: "Create competition-winning dry rubs from scratch. Learn the science behind salt, sugar, and spice combinations that win contests.",
    author: "Rub Queen Lisa",
    readTime: "16 min read",
    difficulty: "Intermediate",
    category: "Seasonings",
    tags: ["rubs", "spices", "seasoning", "competition"],
    views: 12987,
    lastUpdated: "2025-09-08",
    content: [
      {
        type: 'section',
        title: 'The Science of BBQ Rubs',
        content: 'A great BBQ rub is more than just throwing spices together. Each ingredient serves a specific purpose in flavor development, moisture retention, and bark formation.\n\n**Primary Functions:**\n• **Salt**: Draws out moisture, then reabsorbs with flavors\n• **Sugar**: Caramelizes for color and balances heat\n• **Spices**: Provide complexity and signature flavors\n• **Aromatics**: Create the "nose" that hits you first\n\n**The Maillard Reaction:**\nSugars and proteins react under heat to create the beautiful bark and complex flavors that make BBQ special. Your rub composition directly affects this process.'
      },
      {
        type: 'section',
        title: 'Essential Rub Components',
        content: '**Salt (20-30% of rub):**\n• Kosher salt: Clean flavor, easy to measure\n• Sea salt: More complex mineral notes\n• Celery salt: Adds umami depth\n• Garlic salt: Dual-purpose flavoring\n\n**Sugars (15-25% of rub):**\n• Brown sugar: Molasses notes, classic BBQ flavor\n• White sugar: Pure sweetness, better caramelization\n• Turbinado: Raw sugar with subtle molasses\n• Honey powder: Concentrated sweetness, unique flavor\n\n**Base Spices (30-40% of rub):**\n• Paprika: Color, mild pepper flavor, smokiness\n• Chili powder: Blend of peppers and spices\n• Cumin: Earthy, warm, essential for Southwest flavors\n• Black pepper: Heat, aromatics, classic BBQ taste'
      },
      {
        type: 'tip',
        title: 'Rub Ratios',
        content: 'Start with a 40% salt/sugar base, 40% primary spices (paprika, chili powder), and 20% accent spices (garlic, onion, etc.). Adjust from there based on taste preferences.'
      },
      {
        type: 'section',
        title: 'Competition-Style Beef Rub',
        content: '**Texas Brisket Rub (Simple & Effective):**\n• 1 cup coarse black pepper (50%)\n• 1 cup kosher salt (50%)\n• Optional: 2 tbsp granulated garlic\n\n**Competition Beef Rub (Complex):**\n• ½ cup kosher salt\n• ¼ cup brown sugar\n• ¼ cup coarse black pepper\n• ¼ cup paprika\n• 2 tbsp chili powder\n• 2 tbsp granulated garlic\n• 1 tbsp onion powder\n• 1 tbsp cumin\n• 1 tsp cayenne pepper\n• 1 tsp dry mustard\n\n**Application for Beef:**\n• Apply 12-24 hours before cooking\n• Use 2-3 tbsp per pound of meat\n• Pat meat dry first for better adhesion\n• Let form pellicle (tacky surface) before cooking'
      },
      {
        type: 'section',
        title: 'Award-Winning Pork Rub',
        content: '**Sweet & Savory Pork Rub:**\n• ½ cup brown sugar\n• ¼ cup kosher salt\n• 3 tbsp paprika\n• 2 tbsp chili powder\n• 2 tbsp granulated garlic\n• 2 tbsp onion powder\n• 1 tbsp black pepper\n• 1 tbsp cumin\n• 1 tsp cayenne\n• 1 tsp dry mustard\n• 1 tsp thyme\n• 1 tsp oregano\n\n**Competition Rib Rub:**\n• ¾ cup brown sugar (more for caramelization)\n• ¼ cup kosher salt\n• 3 tbsp paprika\n• 2 tbsp turbinado sugar\n• 1 tbsp each: garlic powder, onion powder, chili powder\n• 2 tsp black pepper\n• 1 tsp each: cumin, dry mustard, cayenne\n\n**Pork Application Tips:**\n• Apply 2-8 hours before cooking\n• Use yellow mustard as binder for better adhesion\n• Pork can handle sweeter rubs than beef\n• Reapply during cook if rub washes off from spritzing'
      },
      {
        type: 'section',
        title: 'Poultry Rub Mastery',
        content: '**Classic Chicken Rub:**\n• ¼ cup kosher salt\n• ¼ cup brown sugar\n• 3 tbsp paprika\n• 2 tbsp garlic powder\n• 2 tbsp onion powder\n• 1 tbsp black pepper\n• 1 tbsp thyme\n• 1 tbsp sage\n• 1 tsp cayenne\n\n**Crispy Skin Poultry Rub:**\n• ⅓ cup kosher salt (higher salt for crispy skin)\n• 2 tbsp white sugar\n• 2 tbsp paprika\n• 1 tbsp garlic powder\n• 1 tbsp onion powder\n• 2 tsp black pepper\n• 1 tsp baking powder (helps crispiness)\n• 1 tsp dried herbs (rosemary, thyme)\n\n**Poultry Tips:**\n• Higher salt ratio helps crispy skin\n• Apply under skin when possible\n• Let sit uncovered in fridge 4-24 hours\n• Pat completely dry before cooking'
      },
      {
        type: 'tip',
        title: 'Rub Storage & Freshness',
        content: 'Store rubs in airtight containers away from light and heat. Label with date - most rubs stay fresh 6-12 months. Grind whole spices fresh when possible for maximum flavor impact.'
      },
      {
        type: 'section',
        title: 'Advanced Rub Techniques',
        content: '**Layered Seasoning:**\n1. Base layer: Salt only, 24 hours ahead\n2. Flavor layer: Main rub, 4-12 hours ahead\n3. Finish layer: Delicate herbs just before cooking\n\n**Binding Agents:**\n• Yellow mustard: Most popular, neutral flavor\n• Olive oil: Rich flavor, good for Mediterranean herbs\n• Worcestershire: Adds umami depth\n• Hot sauce: Builds heat layers\n• Pickle juice: Tangy, tenderizing acids\n\n**Rub Injection Combos:**\n• Inject with savory liquids (broth, wine)\n• Follow with dry rub for double flavor impact\n• Let injection absorb 2+ hours before applying rub\n• Popular for competition BBQ\n\n**Testing Your Rubs:**\n• Make small batches first\n• Test on chicken thighs (quick cook, cheap)\n• Keep detailed notes on ratios\n• Adjust salt/sugar balance based on results\n• Get feedback from friends and family'
      }
    ]
  },
  8: {
    id: 8,
    title: "Regional BBQ Sauce Styles Explained",
    description: "Master the four classic American BBQ sauce styles with authentic recipes from Kansas City, Carolina, Texas, and Alabama.",
    author: "Sauce Boss Tony",
    readTime: "14 min read",
    difficulty: "Beginner",
    category: "Sauces",
    tags: ["sauce", "regional", "kansas-city", "carolina", "texas"],
    views: 13641,
    lastUpdated: "2025-09-05",
    content: [
      {
        type: 'section',
        title: 'The Regional Sauce Map',
        content: 'American BBQ sauces tell the story of regional tastes, available ingredients, and cultural influences. Each major BBQ region developed distinct sauce styles based on local preferences and immigrant influences.\n\n**The Big Four Regions:**\n• **Kansas City**: Sweet, thick, molasses-based\n• **Carolina**: Vinegar-based, tangy, thin\n• **Texas**: Tomato-based, bold, smoky\n• **Alabama**: Mayo-based white sauce, unique to North Alabama\n\n**Philosophy Differences:**\n• Some regions use sauce as a mop during cooking\n• Others apply only at the table\n• Some believe good BBQ needs no sauce at all\n• Understanding regional preferences helps you choose the right style'
      },
      {
        type: 'section',
        title: 'Kansas City Style: Sweet & Thick',
        content: '**Characteristics:**\n• Base: Tomato/ketchup with molasses\n• Texture: Thick, clingy, glossy\n• Flavor: Sweet with tangy balance\n• Color: Deep reddish-brown\n• Best with: All meats, especially ribs\n\n**Authentic KC Sauce Recipe:**\n• 2 cups ketchup\n• ½ cup apple cider vinegar\n• ½ cup brown sugar\n• ¼ cup molasses\n• 2 tbsp Worcestershire sauce\n• 2 tbsp yellow mustard\n• 1 tbsp liquid smoke\n• 2 tsp garlic powder\n• 2 tsp onion powder\n• 1 tsp black pepper\n• 1 tsp cayenne pepper\n• 1 tsp paprika\n\n**Cooking Instructions:**\n1. Combine all ingredients in saucepan\n2. Simmer 20-30 minutes, stirring frequently\n3. Adjust sweetness with brown sugar\n4. Adjust tang with vinegar\n5. Cool and refrigerate - flavors improve overnight'
      },
      {
        type: 'tip',
        title: 'KC Sauce Tips',
        content: 'KC sauce burns easily due to high sugar content. Apply only in the last 15-30 minutes of cooking, or serve on the side. The thick consistency makes it perfect for ribs and as a dipping sauce.'
      },
      {
        type: 'section',
        title: 'Carolina Styles: East vs West',
        content: '**Eastern North Carolina (Whole Hog Style):**\n• Base: Vinegar and red pepper\n• Texture: Thin, penetrating\n• Flavor: Tangy, hot, clean\n• Traditional use: Mop sauce and finishing sauce\n\n**Eastern NC Recipe:**\n• 2 cups apple cider vinegar\n• 2 tbsp red pepper flakes\n• 1 tbsp brown sugar\n• 2 tsp salt\n• 1 tsp black pepper\n• 1 tsp cayenne\n\n**Western North Carolina (Lexington Style):**\n• Base: Vinegar with ketchup added\n• Color: Pinkish from tomato addition\n• Flavor: Tangy with slight sweetness\n• Controversy: Purists prefer Eastern style\n\n**Western NC Recipe:**\n• 1½ cups apple cider vinegar\n• ½ cup ketchup\n• 2 tbsp brown sugar\n• 1 tbsp red pepper flakes\n• 2 tsp salt\n• 1 tsp black pepper\n\n**South Carolina Mustard Sauce:**\n• Base: Yellow mustard and vinegar\n• Origin: German immigrant influence\n• Flavor: Tangy, sharp, unique\n• Best with: Pork, especially pulled pork\n\n**SC Mustard Recipe:**\n• 1 cup yellow mustard\n• ½ cup apple cider vinegar\n• ¼ cup brown sugar\n• 2 tbsp honey\n• 1 tbsp Worcestershire\n• 1 tsp garlic powder\n• Hot sauce to taste'
      },
      {
        type: 'section',
        title: 'Texas Style: Bold & Smoky',
        content: '**Characteristics:**\n• Philosophy: Good brisket needs no sauce\n• When used: Thin, tomato-based, not sweet\n• Flavor: Smoky, spicy, bold\n• Texture: Thinner than KC, thicker than Carolina\n\n**Central Texas Sauce Recipe:**\n• 1 cup tomato sauce\n• ½ cup beef broth\n• ¼ cup apple cider vinegar\n• 2 tbsp Worcestershire sauce\n• 2 tbsp chili powder\n• 1 tbsp cumin\n• 1 tbsp paprika\n• 2 tsp garlic powder\n• 2 tsp onion powder\n• 1 tsp black pepper\n• 1 tsp cayenne\n• 1 tsp liquid smoke\n• Salt to taste\n\n**Texas Mop Sauce (For Basting):**\n• 1 cup beef broth\n• ½ cup apple cider vinegar\n• ¼ cup Worcestershire\n• 2 tbsp butter\n• 1 tbsp each: garlic powder, onion powder\n• 1 tsp each: salt, pepper, cayenne\n\n**Usage:**\n• Apply mop sauce during last few hours\n• Serve finishing sauce on the side\n• Never mask the meat flavor\n• Complement, don\'t overpower'
      },
      {
        type: 'section',
        title: 'Alabama White Sauce: The Unique One',
        content: '**History:**\n• Created by Big Bob Gibson in 1925\n• Unique to North Alabama\n• Originally for smoked chicken\n• Now popular throughout the South\n\n**Characteristics:**\n• Base: Mayonnaise and vinegar\n• Color: White/cream\n• Flavor: Tangy, creamy, peppery\n• Best with: Chicken, turkey, pork\n\n**Authentic Alabama White Sauce:**\n• 1½ cups mayonnaise\n• ¼ cup apple cider vinegar\n• 2 tbsp lemon juice\n• 1 tbsp prepared horseradish\n• 2 tsp black pepper\n• 1 tsp salt\n• 1 tsp garlic powder\n• ½ tsp cayenne pepper\n\n**Preparation:**\n1. Whisk all ingredients until smooth\n2. Refrigerate at least 2 hours\n3. Adjust tang with vinegar/lemon\n4. Adjust heat with cayenne\n5. Keeps refrigerated 1 week\n\n**Serving Suggestions:**\n• Brush on chicken last 10 minutes of cooking\n• Excellent dipping sauce for smoked wings\n• Great on pulled pork sandwiches\n• Try on smoked vegetables'
      },
      {
        type: 'tip',
        title: 'Sauce Safety',
        content: 'Never put sauce back in the original container after it\'s touched raw or cooked meat. Keep separate portions for basting and serving. Mayo-based sauces need constant refrigeration.'
      },
      {
        type: 'section',
        title: 'Making Your Own Signature Sauce',
        content: '**Start with a Base:**\n• Choose your regional inspiration\n• Identify your preferred flavor profile\n• Consider what meats you cook most\n\n**Customization Ideas:**\n• **Fruit additions**: Peach, apple, cherry for sweetness\n• **Heat sources**: Chipotle, habanero, ghost pepper\n• **Umami boosters**: Soy sauce, fish sauce, anchovies\n• **Smokiness**: Liquid smoke, smoked paprika, bourbon\n• **Texture**: Pureed fruits, whole spices, herb pieces\n\n**Testing Process:**\n1. Make small batches (1 cup each)\n2. Test on simple proteins (chicken thighs)\n3. Get feedback from family and friends\n4. Document successful ratios\n5. Scale up winning recipes\n\n**Storage Tips:**\n• Most sauces keep 2-4 weeks refrigerated\n• Freeze in ice cube trays for portions\n• Can/jar using proper canning methods\n• Label with ingredients for gifts\n• pH below 4.0 needed for safe canning'
      }
    ]
  }
};

export default function GuidePage() {
  const params = useParams();
  const paramsObj = params as { id?: string };
  const guideId = parseInt((paramsObj.id || '') as string);
  const guide = guides[guideId as keyof typeof guides];
  
  // Interactive state
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'BBQ_Master_2023', content: 'This guide is fantastic! Finally nailed my first brisket using these techniques.', timestamp: '2 days ago', likes: 12 },
    { id: 2, author: 'SmokeRing_Pro', content: 'The probe test tip is gold. Game changer for knowing when it\'s actually done.', timestamp: '1 week ago', likes: 8 },
    { id: 3, author: 'BackyardPitmaster', content: 'Great breakdown of wood types. I was using mesquite for everything - no wonder it was bitter!', timestamp: '2 weeks ago', likes: 15 }
  ]);

  const handleHelpfulClick = (helpful: boolean) => {
    setWasHelpful(helpful);
    // In a real app, this would send to analytics/database
    console.log(`Guide ${guideId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    // In a real app, this would save to database
    console.log(`Guide ${guideId} rated ${stars} stars`);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'You',
        content: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <Link href="/guides" className="text-orange-600 hover:text-orange-700">
            ← Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/guides" 
            className="flex items-center text-gray-600 hover:text-orange-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {guide.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{guide.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{guide.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {guide.author}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {guide.readTime}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                {guide.difficulty}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {guide.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            {guide.content?.map((section, index) => (
              <div key={index} className="mb-8">
                {section.type === 'section' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                )}
                {section.type === 'tip' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">💡</span>
                      <h3 className="font-semibold text-yellow-900">{section.title}</h3>
                    </div>
                    <p className="text-yellow-800">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Interactive Feedback Section */}
          <div className="border-t pt-8 mt-12 space-y-8">
            
            {/* Helpful Rating */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Was this guide helpful?</h3>
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleHelpfulClick(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    wasHelpful === true ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-green-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes {wasHelpful === true && '✓'}
                </button>
                <button
                  onClick={() => handleHelpfulClick(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    wasHelpful === false ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-red-50'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  No {wasHelpful === false && '✓'}
                </button>
              </div>
              {wasHelpful !== null && (
                <p className="text-sm text-gray-600">
                  {wasHelpful ? 'Thanks for your feedback! 🎉' : 'Thanks for letting us know. We\'ll work to improve this guide.'}
                </p>
              )}
            </div>

            {/* Star Rating */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate this guide</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`transition-colors ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {rating} star{rating !== 1 ? 's' : ''} - Thank you!
                  </span>
                )}
              </div>
            </div>

            {/* Share Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigator.share ? navigator.share({ title: guide.title, url: window.location.href }) : alert('Guide URL copied to clipboard!')}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex-1"
              >
                <Share2 className="w-4 h-4" />
                Share Guide
              </button>
              <button 
                onClick={() => alert('Added to favorites! (This would save to your profile in a real app)')}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Heart className="w-4 h-4" />
                Save to Favorites
              </button>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Community Discussion</h3>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  {showComments ? 'Hide' : 'Show'} Comments ({comments.length})
                </button>
              </div>

              {showComments && (
                <div className="space-y-6">
                  {/* Add Comment */}
                  <div className="border-b border-gray-200 pb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience with this guide..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-sm text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.content}</p>
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600">
                            <ThumbsUp className="w-3 h-3" />
                            {comment.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}