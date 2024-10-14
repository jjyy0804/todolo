import React from 'react';
// import{ useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import NavigationBar from './common/NavigationBar';
import '../calendar.css';

// import useUserStore from '../store/useUserstore';
// import axios, { AxiosError, AxiosResponse } from 'axios';
// import { type EventClickArg } from '@fullcalendar/core';

export default function Calendar() {
  // const { userInfo, isAuthenticated } = useUserStore();
  // const [tasks, setTasks] = useState([]);

  /* 
  useEffect(() => {
    // login 했고, team이 지정이 되어있때만 api 호출
    if (isAuthenticated && userInfo.team !== '') {
      axios
        .get('/')
        .then(function (response: AxiosResponse<T>) {
          // handle success
          console.log(response);
        })
        .catch(function (error: AxiosError) {
          console.log('Calendar get Data Error...', error);
        })
        .finally(function () {
          // always executed
        });
    }
  }, []);
  */
  // temp data => will be deleted when it's connected api and accessible database
  const tasks = [
    {
      title: 'html1',
      start: '2024-10-10',
      end: '2024-10-14',
      color: '#F2DCF7',
    },
    {
      title: 'html2',
      start: '2024-10-10',
      end: '2024-10-14',
      color: '#F2DCF7',
    },
    {
      title: 'html3',
      start: '2024-10-10',
      end: '2024-10-14',
      color: '#F2DCF7',
    },
    {
      title: 'html4',
      start: '2024-10-10',
      end: '2024-10-14',
      color: '#F2DCF7',
    },
    {
      title: 'css',
      start: '2024-10-12',
      end: '2024-10-16',
      color: '#F2DCF7',
    },
    {
      title: 'node.js',
      start: '2024-10-13',
      end: '2024-10-21',
      color: '#FFE1A7',
    },
    {
      title: 'mongoose',
      start: '2024-10-14',
      end: '2024-10-21',
      color: 'green',
    },
  ];

  // eventClickHandler param으로 checkInfo:EventClickArg 삽입해야함. (에러로 잠시 빼놓은것..)
  const eventClickHandler = () => {
    // calendar detail modal open
  };

  return (
    <>
      <NavigationBar />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        dayMaxEvents={true}
        events={tasks}
        eventClick={eventClickHandler}
        editable={true}
      />
    </>
  );
}
