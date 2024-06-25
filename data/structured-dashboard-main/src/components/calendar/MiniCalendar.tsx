'use client';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// Chakra imports
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
// Custom components
import Card from 'components/card/Card';

export default function MiniCalendar(props: {
  selectRange: boolean;
  [x: string]: any;
}) {
  const { selectRange, ...rest } = props;
  const [value, onChange] = useState(new Date());
  return (
    <Card
      className='items-center flex flex-col w-full max-w-max-content p-5 h-max-content'
      {...rest}
    >
      <Calendar
        onChange={onChange}
        value={value}
        selectRange={selectRange}
        view={'month'}
        tileContent={<span className='text-gray-500' />}
        prevLabel={<div className='w-6 h-6 mt-1'><MdChevronLeft /></div>}
        nextLabel={<div className='w-6 h-6 mt-1'><MdChevronRight /></div>}
      />
    </Card>
  );
}
