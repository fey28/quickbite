// src/data/mockRestaurants.js
// Imaginile stocate în: /public/images/restaurants/<restaurant-id>/<menuItem-id>.jpg
export const mockRestaurants = [
  {
    id: 'la-pizzerie',
    name: 'La Pizzerie',
    menuItems: [
      {
        id: 'm1',
        name: 'Margherita',
        description: 'Pizza clasică cu roșii proaspete, mozzarella și busuioc.',
        price: 25,
        category: 'Pizza',
        weight: '500g',
        imagePath: '/images/restaurants/la-pizzerie/m1.png'
      },
      {
        id: 'm2',
        name: 'Diavola',
        description: 'Pizza cu salam picant, mozzarella și fulgi de ardei iute.',
        price: 30,
        category: 'Pizza',
        weight: '550g',
        imagePath: '/images/restaurants/la-pizzerie/m2.png'
      },
      {
        id: 'm3',
        name: 'Quattro Formaggi',
        description: 'Amestec de patru brânzeturi: mozzarella, gorgonzola, parmezan și fontina.',
        price: 35,
        category: 'Pizza',
        weight: '550g',
        imagePath: '/images/restaurants/la-pizzerie/m3.png'
      },
      {
        id: 'm4',
        name: 'Spaghetti Carbonara',
        description: 'Paste cu ou, pecorino romano, pancetta și piper negru.',
        price: 28,
        category: 'Paste',
        weight: '400g',
        imagePath: '/images/restaurants/la-pizzerie/m4.png'
      },
      {
        id: 'm5',
        name: 'Tiramisu',
        description: 'Desert italian tradițional cu mascarpone, cafea și cacao.',
        price: 18,
        category: 'Desert',
        weight: '200g',
        imagePath: '/images/restaurants/la-pizzerie/m5.png'
      },
    ],
  },
  {
    id: 'burger-house',
    name: 'Burger House',
    menuItems: [
      {
        id: 'b1',
        name: 'Classic Burger',
        description: 'Burger de vită cu salată, roșii, ceapă și sos special.',
        price: 35,
        category: 'Burgeri',
        weight: '350g',
        imagePath: '/images/restaurants/burger-house/b1.jpg'
      },
      {
        id: 'b2',
        name: 'Bacon Deluxe',
        description: 'Burger de vită cu bacon crocant, cheddar și sos BBQ.',
        price: 40,
        category: 'Burgeri',
        weight: '380g',
        imagePath: '/images/restaurants/burger-house/b2.jpg'
      },
      {
        id: 'b3',
        name: 'Veggie Burger',
        description: 'Burger vegetarian cu legume la grătar, avocado și aioli.',
        price: 32,
        category: 'Burgeri',
        weight: '300g',
        imagePath: '/images/restaurants/burger-house/b3.jpg'
      },
      {
        id: 'b4',
        name: 'Sweet Potato Fries',
        description: 'Cartofi dulci prăjiți, serviți cu dip de usturoi.',
        price: 15,
        category: 'Garnituri',
        weight: '250g',
        imagePath: '/images/restaurants/burger-house/b4.jpg'
      },
      {
        id: 'b5',
        name: 'Milkshake',
        description: 'Milkshake cremos de vanilie cu frișcă.',
        price: 20,
        category: 'Băuturi',
        weight: '350g',
        imagePath: '/images/restaurants/burger-house/b5.jpg'
      },
    ],
  },
  {
    id: 'sushi-zen',
    name: 'Sushi Zen',
    menuItems: [
      {
        id: 's1',
        name: 'Salmon Nigiri',
        description: 'Sushi presat manual cu felie de somon proaspăt.',
        price: 12,
        category: 'Sushi',
        weight: '50g',
        imagePath: '/images/restaurants/sushi-zen/s1.jpg'
      },
      {
        id: 's2',
        name: 'Tuna Sashimi',
        description: 'Felii de ton premium, servite cu wasabi și sos de soia.',
        price: 18,
        category: 'Sashimi',
        weight: '60g',
        imagePath: '/images/restaurants/sushi-zen/s2.jpg'
      },
      {
        id: 's3',
        name: 'California Roll',
        description: 'Rulou interior-exterior cu crab, avocado și castravete.',
        price: 22,
        category: 'Rulouri',
        weight: '150g',
        imagePath: '/images/restaurants/sushi-zen/s3.jpg'
      },
      {
        id: 's4',
        name: 'Spicy Tuna Roll',
        description: 'Rulou cu ton și sos picant.',
        price: 24,
        category: 'Rulouri',
        weight: '160g',
        imagePath: '/images/restaurants/sushi-zen/s4.jpg'
      },
      {
        id: 's5',
        name: 'Miso Soup',
        description: 'Supă caldă de miso cu tofu și alge marine.',
        price: 8,
        category: 'Aperitive',
        weight: '250g',
        imagePath: '/images/restaurants/sushi-zen/s5.jpg'
      },
    ],
  },
];