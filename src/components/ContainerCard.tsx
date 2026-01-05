interface ContainerCardProps {
  caption: String
  item: Number
}

export default function ContainerCard({item, caption} : ContainerCardProps) {

  return (
    <div className="w-full h-35 p-4 shadow-xl bg-gray-50 text-lg rounded-2xl 
                    items-center justify-center">
                      <div className="text-neutral-700 font-medium">{caption}</div>
                      <div className="text-neutral-700 font-light">{Number(item.toFixed(0)).toLocaleString()}</div>
    </div>
  );
}