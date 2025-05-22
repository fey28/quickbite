import React from 'react';

export default function ProductCard({
  id,
  name,
  description,
  price,
  weight,
  imagePath,
  onAdd,
}) {
  return (
    <div
      className="bg-card rounded-2xl shadow p-4 hover:scale-[1.01] transition w-full max-w-sm cursor-pointer"
      onClick={onAdd}
    >
      <img
        src={imagePath}
        alt={name}
        className="rounded-xl w-full h-48 object-cover"
      />
      <div className="mt-3">
        <h3 className="text-lg font-semibold">
          {name}{' '}
          <span className="text-sm text-secondaryText">({weight})</span>
        </h3>
        <p className="text-sm text-secondaryText mt-1">{description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-tomato font-bold text-lg">{price} RON</span>
          <button
            onClick={e => {
              e.stopPropagation();
              onAdd();
            }}
            className="bg-tomato hover:bg-coral text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            Adaugă
          </button>
        </div>
      </div>
    </div>
  );
}