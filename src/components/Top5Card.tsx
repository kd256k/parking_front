import type {ChartDataItem} from '@/types/dashboard'
import { JSX } from 'react';

interface Top5CardProps {
  items: ChartDataItem[];
  caption: string;
  regionName: string;
}

export default function Top5Card({items, caption, regionName}:Top5CardProps) {

  return (
    <div className="h-full p-8 shadow-xl bg-gray-50 text-lg text-neutral-700 rounded-2xl 
                    items-center justify-center space-y-4">
                      <div className="text-neutral-700 font-medium ">{caption}</div>
                      <div className="flex flex-col text-neutral-700 font-light text-sm ">{
                        items?.map(item=><div key={regionName + '_' + item.locale}>
                           <div>{item.locale}</div>
                          <div>{Number(item.count.toFixed(0)).toLocaleString()}</div>
                                          </div>) 
      
                      }</div>
    </div>
  );
}