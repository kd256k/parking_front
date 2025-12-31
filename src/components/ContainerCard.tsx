interface ContainerCardProps {
 item: Number
 caption: String
}

export default function ContainerCard({item, caption} : ContainerCardProps) {

  return (
    <div className="w-full h-35 p-4 shadow-xl bg-gray-50 text-lg rounded-2xl 
                    items-center justify-center">
                      <div className="text-neutral-700 font-bold">{caption}</div>
                      <div className="text-neutral-700 font-bold">{String(item)}</div>
    </div>
  );
}