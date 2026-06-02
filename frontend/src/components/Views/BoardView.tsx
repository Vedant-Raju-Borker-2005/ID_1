'use client';

import { useState } from 'react';

interface Card {
  id: string;
  title: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

interface BoardViewProps {
  columns: Column[];
  onMoveCard: (cardId: string, toColumnId: string) => void;
}

export function BoardView({ columns, onMoveCard }: BoardViewProps) {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedCard) {
      onMoveCard(draggedCard, columnId);
      setDraggedCard(null);
    }
  };

  return (
    <div className="flex space-x-4 overflow-x-auto p-4 select-none">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-gray-50/70 border border-gray-200/50 rounded-2xl p-4 transition-all duration-200"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">{column.title}</h3>
            <span className="text-[10px] bg-gray-200/60 px-2 py-0.5 rounded-full font-bold text-gray-500">
              {column.cards.length}
            </span>
          </div>

          <div className="space-y-2 min-h-[300px]">
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-brand-500/20 transition-all duration-200"
              >
                <div className="text-sm font-semibold text-gray-800 leading-snug">{card.title}</div>
                <div className="mt-3 flex justify-between items-center text-[10px] text-gray-400">
                  <span>ID: {card.id.substring(0, 5)}</span>
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold border border-white">
                      U
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {column.cards.length === 0 && (
              <div className="h-20 flex items-center justify-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                Drag layouts here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
