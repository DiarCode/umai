import type { Restaurant } from '../types/entry.type'

export const restaurants: Restaurant[] = [
  {
    id: '1',
    code: 'pizza-place',
    name: 'Pizza Place',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE2o3qZjCGPaAuBdfj8LsJyWwH02tRA432Uw&s',
    status: 'open',
    description: 'Лучшие пиццы в городе с разнообразными начинками и хрустящей корочкой.',
  },
  {
    id: '2',
    code: 'sushi-bar',
    name: 'Sushi Bar',
    status: 'open',
    description: 'Свежайший суши и роллы, приготовленные с любовью и заботой о качестве.',
  },
  {
    id: '3',
    code: 'burger-house',
    name: 'Burger House',
    status: 'closed',
    description: 'Вкусные гамбургеры и свежие салаты.',
  },
]
