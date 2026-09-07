export interface IFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface IFaqSectionProps {
  title?: string;
  sourceUrl?: string;
  items?: IFaqItem[];
  className?: string;
}
