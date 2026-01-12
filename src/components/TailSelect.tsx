import { ChangeEvent } from "react";

interface TailSelectProps {
  ref: React.RefObject<HTMLSelectElement | null>;
  opk: string[];
  opv: string[];
  title?: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

export default function TailSelect({ ref, opk, opv, title = "", value, setValue, disabled=false }: TailSelectProps) {
  //ref 사용 전 선언

  const onHandle = (e: ChangeEvent<HTMLSelectElement>) => {
    if(setValue) {
      setValue(e.currentTarget.value);
    }
  }

  return (
    <div>
      {title &&
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </label>
      }
      <select ref={ref}
        onChange={onHandle}
        value={value}
        className={`bg-white border text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5
                    ${disabled ? 'text-gray-400 border-gray-300' : 'text-sky-900 border-sky-300'}`}
        disabled={disabled} >
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