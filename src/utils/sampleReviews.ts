// Sample reviews for demonstration
// This would typically come from a database in a real application

export const sampleReviews = {
  '1': [ // Perfect Smoked Brisket
    {
      id: '1001',
      author: 'SmokeRingMaster',
      rating: 5,
      title: 'Best brisket recipe ever!',
      comment: 'This recipe produced the most amazing brisket I\'ve ever made. The bark was perfect, the smoke ring was beautiful, and my family couldn\'t stop raving about it. The 12-hour cook time is worth every minute.',
      date: '2024-12-20T10:30:00Z',
      helpful: 12,
      modifications: 'I added a mustard binder before applying the rub, and used a mix of oak and hickory wood.',
      wouldMakeAgain: true
    },
    {
      id: '1002',
      author: 'TexasPitBoss',
      rating: 4,
      title: 'Great results with minor tweaks',
      comment: 'Excellent recipe! The brisket turned out tender and flavorful. I followed the recipe exactly and got great results. Only wish was that the bark could have been a bit crispier.',
      date: '2024-12-15T15:45:00Z',
      helpful: 8,
      modifications: 'Used brown sugar in the rub for a bit more sweetness.',
      wouldMakeAgain: true
    }
  ],
  '2': [ // Smoked Pulled Pork
    {
      id: '2001',
      author: 'PorkPullerPro',
      rating: 5,
      title: 'Perfect for beginners!',
      comment: 'This was my first attempt at pulled pork and it turned out amazing! The apple wood gave it such a nice flavor, and the meat pulled apart like butter. Fed the whole family and had leftovers for days.',
      date: '2024-12-18T12:20:00Z',
      helpful: 15,
      wouldMakeAgain: true
    }
  ],
  '3': [ // BBQ Chicken Wings
    {
      id: '3001',
      author: 'WingLover99',
      rating: 5,
      title: 'Game day winner!',
      comment: 'Made these for the game and they disappeared in minutes! The skin was perfectly crispy and the flavor was incredible. Cherry wood was the perfect choice.',
      date: '2024-12-22T18:15:00Z',
      helpful: 6,
      modifications: 'Added some hot sauce to the glaze for extra kick.',
      wouldMakeAgain: true
    }
  ],
  '4': [ // Smoked Ribs
    {
      id: '4001',
      author: 'RibMaster2000',
      rating: 5,
      title: 'Competition quality ribs',
      comment: 'These ribs are absolutely phenomenal! The 3-2-1 method works perfectly. The meat was fall-off-the-bone tender but still had great texture. Best ribs I\'ve ever made.',
      date: '2024-12-19T14:30:00Z',
      helpful: 20,
      modifications: 'Used butter and honey instead of just butter when wrapping.',
      wouldMakeAgain: true
    },
    {
      id: '4002',
      author: 'BackyardSmoker',
      rating: 4,
      title: 'Delicious but took longer than expected',
      comment: 'Great recipe with excellent results. The ribs were tender and flavorful. Only issue was it took about 7 hours instead of 6, but that might be my smoker running a bit cool.',
      date: '2024-12-17T16:45:00Z',
      helpful: 5,
      wouldMakeAgain: true
    }
  ]
};

// Function to initialize sample reviews in localStorage
export const initializeSampleReviews = () => {
  if (typeof window === 'undefined') return;
  
  Object.entries(sampleReviews).forEach(([recipeId, reviews]) => {
    const storageKey = `reviews_${recipeId}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    }
  });
};