import React from 'react';
import type { MyInputProps } from '../types/inputType';

const MyInput: React.FC<MyInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  autoComplete,
}) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">
        {icon}
      </div>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2
			 focus:ring-green-500 focus:border-transparent bg-green-50 placeholder:text-green-400"
      autoComplete={autoComplete}
    />
  </div>
);

export default MyInput;
