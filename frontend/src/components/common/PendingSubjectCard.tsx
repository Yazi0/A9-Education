import React from "react";
import api from "../../api/axios";

interface PendingSubjectCardProps {
  subjectId: number;
  onEnrollSuccess: () => void;
}

const PendingSubjectCard: React.FC<PendingSubjectCardProps> = ({ subjectId, onEnrollSuccess }) => {
  const handleEnroll = async () => {
    try {
      await api.post("enrollments/create/", { subject: subjectId });
      alert("Enrolled successfully!");
      onEnrollSuccess();
    } catch (err) {
      console.error(err);
      alert("Enrollment failed!");
    }
  };

  return (
    <div>
      <button onClick={handleEnroll}>Enroll</button>
    </div>
  );
};

export default PendingSubjectCard;
