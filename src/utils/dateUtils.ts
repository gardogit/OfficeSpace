// Date formatting utilities for consistent date/time display

export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format options for different scenarios
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  // Return relative date for events within the next week
  if (diffInDays === 0) {
    return `Hoy, ${date.toLocaleTimeString('es-ES', timeOptions)}`;
  } else if (diffInDays === 1) {
    return `Mañana, ${date.toLocaleTimeString('es-ES', timeOptions)}`;
  } else if (diffInDays > 0 && diffInDays <= 7) {
    return `${date.toLocaleDateString('es-ES', { weekday: 'long' })}, ${date.toLocaleTimeString('es-ES', timeOptions)}`;
  }
  
  // Full date format for events further away
  return `${date.toLocaleDateString('es-ES', dateOptions)}, ${date.toLocaleTimeString('es-ES', timeOptions)}`;
};

export const formatEventDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startTime = start.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  const endTime = end.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  // Check if it's the same day
  if (start.toDateString() === end.toDateString()) {
    return `${startTime} - ${endTime}`;
  }
  
  // Multi-day event
  const startDate_formatted = start.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric' 
  });
  const endDate_formatted = end.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  return `${startDate_formatted} ${startTime} - ${endDate_formatted} ${endTime}`;
};

export const sortEventsByDate = <T extends { startDate: string }>(events: T[]): T[] => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA.getTime() - dateB.getTime();
  });
};

export const isEventUpcoming = (startDate: string): boolean => {
  const eventDate = new Date(startDate);
  const now = new Date();
  return eventDate.getTime() > now.getTime();
};