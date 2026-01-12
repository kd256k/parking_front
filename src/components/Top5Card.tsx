import type { ChartDataItem } from '@/types/dashboard'
import { JSX } from 'react';

interface Top5CardProps {
  items: ChartDataItem[];
  caption: string;
  regionName: string;
}

const BADGE_COLORS = [
  '#10B981',
  '#06B6D4',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
];

export default function Top5Card({ items, caption, regionName }: Top5CardProps) {

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <h3 className="text-2xl font-bold mb-4 bg-sky-500 text-white px-6 pt-5 pb-4 text-center">{caption}</h3>
      <div className="space-y-4 font-bold pb-2">
        {
          items?.map((item, index) => (<div key={regionName + item.locale}
            className="flex justify-between items-center px-4 pb-3 border-b border-gray-200 last:border-b-0" >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-500 text-white text-lg"
                style={{backgroundColor: BADGE_COLORS[index]}}>
                {index + 1}
              </span>
              <span className="text-neutral-700 text-xl">{item.locale}</span>
            </div>
            <div className="text-neutral-900 text-xl">{Number(item.count.toFixed(0)).toLocaleString()}</div>
          </div>))
        }
      </div>
    </div>
  );
}