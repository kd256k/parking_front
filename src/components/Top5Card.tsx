import type {ChartDataItem} from '@/types/dashboard'
import { JSX } from 'react';

interface Top5CardProps {
  items: ChartDataItem[];
  caption: string;
  regionName: string;
}

export default function Top5Card({items, caption, regionName}:Top5CardProps) {

  return (
    <div className="w-full p-4 shadow-xl bg-gray-50 text-lg text-neutral-700 rounded-2xl 
                    items-center justify-center">
                      <div className="text-neutral-700 font-bold">{caption}</div>
                      <div className="text-neutral-700 font-bold">{
                        items?.map(item=><div key={regionName + '_' + item.locale}>
                           <div>{item.locale}</div>
                          <div>{item.count}</div>
                                          </div>) 
      
                      }</div>
    </div>
  );
}