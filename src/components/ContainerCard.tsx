interface ContainerCardProps {
    caption: string;
    item: number;
    size?: number;
}

export default function ContainerCard({ item, caption, }: ContainerCardProps) {

    const formattedValue = Number(item.toFixed(0),).toLocaleString();
    const unit = caption.toString().includes("비율") ? "%" : caption.toString().includes("평균") ? "개" : "개소";
    return (
        <div className="w-full h-40 shadow-lg bg-white text-lg rounded-2xl overflow-hidden ">
            <div className="h-1/2 bg-sky-500 text-white flex justify-center items-center text-2xl font-bold">
                {caption}
            </div>
            <div className="h-1/2 flex justify-center items-center text-3xl font-bold">
                <div className="flex items-baseline">
                    <span>{formattedValue}</span>
                    <span className="text-2xl ml-2">{unit}</span>
                </div>
            </div>
        </div>

    );
}