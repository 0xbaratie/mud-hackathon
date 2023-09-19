import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DateTimePickerProps {
  selectedDateTime: string;
  setSelectedDateTime: string;
}

const DateTimePicker = ({ selectedDateTime, setSelectedDateTime }: any) => {
  const handleDateTimeChange = (dateTime: any) => {
    setSelectedDateTime(dateTime);
  };

  return (
    <div className="">
      <div className="p-2 border border-gray-300 rounded shadow">
        <DatePicker
          selected={selectedDateTime}
          onChange={handleDateTimeChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="text-gray-900 w-full"
          wrapperClassName="w-full"
          minDate={new Date()}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
