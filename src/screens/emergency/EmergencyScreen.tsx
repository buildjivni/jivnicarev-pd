import React from "react";
import { DoctorsScreen } from "../doctors/DoctorsScreen";
import { Doctor } from "../../types/doctor";

interface EmergencyScreenProps {
  onBookEmergencyDoctor: (doctor: Doctor) => void;
  onExploreAllDoctors?: () => void;
  onPressDoctor?: (doctor: Doctor) => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  onBookEmergencyDoctor,
  onPressDoctor,
}) => {
  return (
    <DoctorsScreen
      initialSpecialty="All"
      initialQuery=""
      initialEmergencyOnly={true}
      onPressDoctor={(doctor) => {
        if (onPressDoctor) onPressDoctor(doctor);
        else onBookEmergencyDoctor(doctor);
      }}
      onPressBook={onBookEmergencyDoctor}
    />
  );
};
