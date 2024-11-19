import React, { createContext, useContext, useState } from 'react';

const TaskReadingContext = createContext();

export const TaskReadingProvider = ({ children }) => {
  const [taskReading, setTaskReading] = useState(true);

  return (
    <TaskReadingContext.Provider value={{ taskReading, setTaskReading }}>
      {children}
    </TaskReadingContext.Provider>
  );
};

export const useTaskReading = () => useContext(TaskReadingContext);