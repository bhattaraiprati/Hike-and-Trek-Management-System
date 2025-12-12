import axios from "axios";
import { urlLink } from "../axiosConfig";

export interface ParticipantsAttendanceDTO {
  participantId: number;
  attendanceStatus: string;
}

export const updateParticipantAttendance = async (eventId: number, attendance: ParticipantsAttendanceDTO[]) => {
  const response = await axios.post(`${urlLink}/organizer/event/makeAttendance/${eventId}`, attendance,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const exportParticipantsToCSV = async (eventId: number) => {
  const response = await axios.get(`/events/${eventId}/participants/export`, {
    responseType: 'blob'
  });
  return response.data;
};

export const sendAttendanceEmail = async (participantId: number) => {
  const response = await axios.post(`/participants/${participantId}/send-attendance-email`);
  return response.data;
};