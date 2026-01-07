import type { ChartDataItem } from '@/types/dashboard'
import { JSX } from 'react';

interface Top5CardProps {
  items: ChartDataItem[];
  caption: string;
  regionName: string;
}

export default function Top5Card({ items, caption, regionName }: Top5CardProps) {

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-neutral-700 text-lg mb-4">{caption}</h3>
      <div className="space-y-3">
        {
          items?.map(item => <div key={regionName + '_' + item.locale}
            className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-b-0" >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-500 text-white text-sm">
                {1}
              </span>
              <span className="text-neutral-700">{item.locale}</span>
            </div>
            <div className="text-neutral-900">{Number(item.count.toFixed(0)).toLocaleString()}</div>
          </div>)

        }
      </div>
    </div>
  );
}