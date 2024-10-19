import React, { useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import apiClient from '../utils/apiClient';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { type EventClickArg } from '@fullcalendar/core';

import '../calendar.css';
import NavigationBar from './common/NavigationBar';
//import ScheduleModal from './common/modal/ScheduleModal';
import CalendarModal from './common/modal/CalendarModal';
import useUserStore from '../store/useUserstore';
// import useUserStore from '../store/useUserstore';

interface Task {
  taskId: string;
  title: string;
  start: string;
  end: string;
  color: string;
}
export default function Calendar() {
  const { user } = useUserStore();
  const [projects, setProjects] = useState<any[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Task | null>(null);

  useEffect(() => {
    // login 했고, team이 지정이 되어있때만 api 호출
    // userStore, scheduleStore 정리되면  변경!!!
    // if (isAuthenticated && user?.team){

    // }
    const accessToken = localStorage.getItem('accessToken');

    apiClient
      .get(
        `api/teams/${user?.team_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        const fetchedProjects = response.data.data[0].projects;
        // console.log({ fetchedProjects });
        setProjects(fetchedProjects);
      });
  }, []);

  const tasks = projects?.map((project) => ({
    taskId: project.tasks._id,
    title: project.tasks.title,
    start: project.tasks.startDate?.split('T')[0],
    end: project.tasks.endDate?.split('T')[0],
    color: project.projectColor || '#FFE1A7',
  }));
  // console.log({ tasks });

  // eventClickHandler param으로 checkInfo:EventClickArg 삽입해야함. (에러로 잠시 빼놓은것..)
  const eventClickHandler = (clickInfo: EventClickArg) => {
    // Calendar Modal open
    const clickedEvent = clickInfo.event.extendedProps as Task;
    setSelectedEvent(clickedEvent);
    setIsModalOpen(true); // Show modal
  };

  // Calendar Modal Close
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedEvent(null); // Clear selected event data
  };

  return (
    <>
      <NavigationBar />
      {/* icon with name(team) display => insert Component later */}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        dayMaxEvents={true}
        events={tasks}
        eventClick={eventClickHandler}
        editable={true}
      />
      {/* { CalendarModal} */}
      {isModalOpen && selectedEvent && (
        <CalendarModal
          isOpen={isModalOpen}
          onClose={closeModal} // Function to close the modal
          taskId={selectedEvent.taskId} // Pass the clicked event details to the modal
        />
      )}
    </>
  );
}
