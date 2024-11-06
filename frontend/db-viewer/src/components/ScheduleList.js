import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { UncontrolledBoard } from '@caldwell619/react-kanban'; // Используем ControlledBoard
import '@caldwell619/react-kanban/dist/styles.css';

const initialBoard = {
  columns: [
    {
      id: 1,
      title: 'Понедельник',
      cards: [
        {
          id: 1,
          title: 'Добавить карточку',
          description: 'Добавить возможность добавления карточки в колонку'
        },
      ]
    },
    {
      id: 2,
      title: 'Вторник',
      cards: [
        {
          id: 2,
          title: 'Добавить карточку',
          description: 'Добавить возможность добавления карточки в колонку'
        },
      ]
    },
  ]
};

const Board = () => {
  const [board, setBoard] = useState(initialBoard);

  const addCard = (columnId) => {
    const title = prompt('Введите название карточки:');
    const description = prompt('Введите описание карточки:');
    if (title) {
      const newCard = {
        id: Date.now(),
        title,
        description
      };

      const updatedColumns = board.columns.map(column => {
        if (column.id === columnId) {
          return { ...column, cards: [...column.cards, newCard] };
        }
        return column;
      });

      setBoard({ columns: updatedColumns });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <UncontrolledBoard
        initialBoard={board}
        allowAddCard={{ on: 'top' }}
        allowRemoveCard
        renderColumnHeader={({ title, id }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3>{title}</h3>
            <Button
              style={{ padding: '3px', width: '30px', height: '30px' }}
              label=""
              icon="pi pi-plus"
              onClick={() => addCard(id)}
            />
          </div>
        )}
        onCardAdd={(card, columnId) => {
          const updatedColumns = board.columns.map(column => {
            if (column.id === columnId) {
              return { ...column, cards: [...column.cards, card] };
            }
            return column;
          });
          setBoard({ columns: updatedColumns });
        }}
      />
    </div>
  );
};

export default Board;
