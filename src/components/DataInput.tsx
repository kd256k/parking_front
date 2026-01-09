
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";

export default function DataInput<T>({
    type = 'text',
    placeholder = '',
    data,
    dataKey,
    setData
}: {
    type?: string;
    placeholder?: string;
    data?: T;
    dataKey?: keyof T;
    setData?: Dispatch<SetStateAction<T | undefined>>;
}) {
    const [localValue, setLocalValue] = useState('');

    useEffect(() => {
        if (data && dataKey) {
            setLocalValue((data[dataKey] as string) || '');
        }
    }, [data, dataKey]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    };

    const onBlur = () => {
        if (setData && dataKey) {
            setData(prev => (prev ? { ...prev, [dataKey]: localValue } : prev));
        }
    };

    return (
        <input
            type={type}
            className="flex-1 bg-white border border-sky-600 rounded p-1 w-full"
            placeholder={placeholder}
            value={localValue}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}