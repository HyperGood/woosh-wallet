import kevin from './kevin.jpg';
import lilly from './lilly.jpg';
import marie from './marie.jpg';

const previousTransactions = [
  {
    id: Math.random().toString(),
    amount: 500,
    user: 'Marie',
    userImage: marie,
    description: 'Feliz Cumpleaños',
    date: '2023-12-12',
  },
  {
    id: Math.random().toString(),
    amount: 500,
    user: 'Roy',
    description: 'Feliz Cumpleaños',
    date: '2023-12-12',
  },
  {
    id: Math.random().toString(),
    amount: -50,
    user: '311-103-2131',
    description: 'Indrive',
    date: '2023-12-11',
  },
  {
    id: Math.random().toString(),
    amount: -100,
    user: 'Kevin',
    userImage: kevin,
    description: 'Feliz Cumpleaños',
    date: '2023-12-10',
  },
  {
    id: Math.random().toString(),
    amount: -250,
    user: 'Lilly',
    userImage: lilly,
    description: 'Prestamo',
    date: '2023-12-09',
  },
];

export default previousTransactions;
