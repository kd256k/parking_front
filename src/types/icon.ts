import { LucideIcon, Building2, Hash, TrendingUp, Percent,} from "lucide-react";

export type IconType = 'Building2' | 'Hash' | 'TrendingUp' | 'Percent';

interface IconConfig {
    Icon:LucideIcon; 
    bgColor:string; 
    iconColor:string;
}
;

export const ICON_CONFIG: Record<IconType, IconConfig> = {
    Building2 : {
        Icon:Building2,
        bgColor: "#7d36d3",
        iconColor: 'text-white',
    },

    Hash : {
        Icon:Hash,
        bgColor: "#39d560",
        iconColor: 'text-white',
    },
    TrendingUp: {
        Icon:TrendingUp,
        bgColor: "#7039d5",
        iconColor: 'text-white' ,
    },
    Percent: {
        Icon:Percent,
        bgColor: "#df8430",
        iconColor: 'text-white' ,
    },
}