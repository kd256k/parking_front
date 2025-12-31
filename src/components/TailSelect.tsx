import { ChangeEvent } from "react";

interface TailSelectProps {
  ref : React.RefObject<HTMLSelectElement| null>, 
  opk : string[], 
  opv : string[], 
  value : string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function TailSelect({ref, opk, opv, value, setValue } : TailSelectProps) {
  //ref 사용 전 선언

  const onHandle = (e:ChangeEvent<HTMLSelectElement>) => {
    setValue(e.currentTarget.value);
  }

  return (
    <div>
      <select ref={ref}
              onChange={onHandle}
              value={value}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              {/* <option value="">--{title}을 선택하세요.--</option> */}

              {
                opk.map((op, idx) => <option key={op} value={op}>
                                    {opv[idx]}
                                    </option>
                )
              }
      </select>
    </div>
  )
}

// <select v={} o.C={}>
//    <option v={}>{opv[idx]}></option>
// </select> 
// opk && opk.map