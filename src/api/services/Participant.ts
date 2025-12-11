import axios from "axios";


export const updateParticipantAttendance = async (participantId: number, status: string) => {
  const response = await axios.put(`/participants/${participantId}/attendance`, { status });
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