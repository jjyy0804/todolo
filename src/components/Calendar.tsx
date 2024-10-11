import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import NavigationBar from './common/NavigationBar';
import '../calendar.css';

// import useUserStore from '../store';
// import axios, { AxiosError, AxiosResponse } from 'axios';

export default function Calendar() {
  // const tasks = [];

  // axios
  //   .get('/')
  //   .then(function (response: AxiosResponse<T>) {
  //     // handle success
  //     console.log(response);
  //   })
  //   .catch(function (error: AxiosError) {
  //     console.log('Calendar get Data Error...', error);
  //   })
  //   .finally(function () {
  //     // always executed
  //   });

  return (
    <>
      <NavigationBar />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        dayMaxEvents={true}
        // events={tasks}
        // height={'900px'}
        editable={true}
      />
    </>
  );
}
