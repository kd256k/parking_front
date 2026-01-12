import { LucideIcon } from "lucide-react";
import { IconType } from "@/types/icon";
import { ICON_CONFIG } from "@/types/icon";

interface ContainerCardProps {
    caption: string;
    item: number;
    iconType?: IconType;
    size?: number;
}

export default function ContainerCard({ item, caption, iconType = 'Building2', }: ContainerCardProps) {

    const config = ICON_CONFIG[iconType];

    const IconComponent = config.Icon;
    const colorClass = config.iconColor;
    const bgClass = config.bgColor;

    const formattedValue = Number(item.toFixed(0),).toLocaleString();
    const unit = caption.toString().includes("비율") ? "%" : caption.toString().includes("평균") ? "개" : "개소";
    return (
        <div className="w-full h-40 p-4 shadow-xl bg-white text-lg rounded-2xl overflow-hidden ">
            <div className="bg-sky-100 h-8 mb-2"></div>
            
                <div className="p-2 rounded-full inline-flex" style={{ backgroundColor: bgClass }}>
                    <IconComponent size={16} className={colorClass} />
                </div>
                <div className="text-neutral-700 font-medium">{caption}</div>
                <div className="text-neutral-700 font-light">{formattedValue}{unit}</div>
        </div>
           
    );
}