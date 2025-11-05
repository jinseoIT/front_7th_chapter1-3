import React from 'react';

import { formatDate } from '../utils/dateUtils';

export function useFormDate(setDate: React.Dispatch<React.SetStateAction<string>>) {
  const handleSelectDate = (date: Date | string) => {
    const d = new Date(date);
    setDate(formatDate(d, d.getDate()));
  };

  return {
    handleSelectDate,
  };
}
