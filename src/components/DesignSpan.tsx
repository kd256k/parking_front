
export default function DesignSpan({ children, bgColor="bg-sky-400", textColor="text-white" }: { children: React.ReactNode, bgColor?: string, textColor?: string }) {
    return (
        <span className={`font-bold ${bgColor} ${textColor} px-2 py-1 rounded-xl`}>{children}</span>
    )
}
