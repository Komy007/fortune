export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
  orientation?: 'upright' | 'reversed';
  position?: TarotPosition;
}

export interface TarotPosition {
  id: number;
  name: string;
  description: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: TarotPosition[];
}

export interface TarotReading {
  id: string;
  spread: TarotSpread;
  cards: TarotCard[];
  question: string;
  interpretation: string;
  timestamp: string;
}




