import type { TailTableProps } from "@/types/tailtable";


export default function TailTable<T>({ className = '',
    headers = [],
    data = [],
    theadClassName = "bg-blue-600 border-blue-400 dark:text-white",
    trClassName = "bg-blue-600 border-blue-400 hover:bg-blue-500",
    firstTdClassName = "text-blue-50 dark:text-blue-100",
    onTrHover = () => {},
    onTrOut = () => {},
    onTrClick= () => {}
    } : TailTableProps<T> ) {

    return (
        <div className={`overflow-x-auto shadow-md sm:rounded-lg ${className}`}>
            <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
                <thead className={`text-xs text-white uppercase border-b ${theadClassName}`}>
                    <tr>
                        { headers.map(header=> <th key={header.key} scope="col" className={`px-6 py-3 text-center ${header.hidden ? 'hidden' : ''}`}>{header.name}</th>) }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((d,row)=><tr key={row} className={`border-b ${trClassName}`} onMouseOver={(e) => onTrHover(e, d)} onMouseOut={(e) => onTrOut(e, d)} onClick={(e) => onTrClick(e, d)}>
                            {headers.map((header, i) => {
                                const content = header.cell ? header.cell(d, (d as any)[header.key]) : (d as any)[header.key];
                                return i === 0
                                    ? <th key={`${row}_${i}`} scope="row" className={`px-6 py-4 font-medium whitespace-nowrap ${firstTdClassName} ${header.className} ${header.hidden ? 'hidden' : ''}`}>{content}</th>
                                    : <td key={`${row}_${i}`} className={`px-6 py-4 ${header.className} ${header.hidden ? 'hidden' : ''}`}>{content}</td>;
                            })
                            }
                        </tr>)
                    }
                </tbody>
            </table>
        </div>

    )
}
