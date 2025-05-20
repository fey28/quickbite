// src/components/CategoryTabs.jsx
import { useState } from 'react';

function CategoryTabs({ categories = [], onSelect }) {
  const [active, setActive] = useState(categories[0]);

  const handleClick = (cat) => {
    setActive(cat);
    onSelect(cat);
  };

  return (
    <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
            active === cat
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
