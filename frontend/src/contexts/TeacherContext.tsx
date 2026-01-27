import { createContext, useContext } from "react";
import type { ReactNode } from "react";

interface Teacher {
  name: string;
  subject: string;
  grades: string[];
  avatar?: string;
}

interface TeacherContextType {
  teacher: Teacher;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider = ({ children }: { children: ReactNode }) => {
  const teacher: Teacher = {
    name: "Mr. Sunil Perera",
    subject: "Mathematics",
    grades: ["Grade 8", "Grade 9", "Grade 10"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunil",
  };

  return (
    <TeacherContext.Provider value={{ teacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = (): TeacherContextType => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within a TeacherProvider");
  }
  return context;
};
