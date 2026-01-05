import type {ChartDataItem} from '@/types/dashboard'

interface Top5CardProps {
  item: ChartDataItem[],
  caption: string
}

export default function Top5Card({item, caption}:Top5CardProps) {
  
  return (
    <div className="w-full p-4 shadow-xl bg-gray-50 text-lg text-neutral-700 rounded-2xl 
                    items-center justify-center">
                      <div className="text-neutral-700 font-bold">{caption}</div>
                      <div className="text-neutral-700 font-bold">{item.values}</div>
    </div>
  );
}