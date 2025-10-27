import { useContext, useState, useEffect, createContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { DataContext } from "../../CONTAINERs/data/context";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import NameCard from "../draft_resume_form/name_card";

const ProfileSectionContext = createContext();

const ProfileSection = () => {
  const { userInfo } = useContext(DataContext);

  const [formData, setFormData] = useState(null);
  const [resumeOnFocus, setResumeOnFocus] = useState(false);
  const [onNameCardEdit, setOnNameCardEdit] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFormData(userInfo);
    }
  }, [userInfo]);

  /* { contact } ----------------------------------------------------------------------------- */
  const update_cell = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        cell: value,
      },
    }));
  };
  const update_email = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        email: value,
      },
    }));
  };
  const add_contact_extra_row = (type, value) => {
    setFormData((prevData) => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        extra: [
          ...prevData.contact.extra,
          { contact_type: type, contact_value: value },
        ],
      },
    }));
  };
  const update_contact_extra_row = (index, type, value) => {
    setFormData((prevData) => {
      const newExtra = [...prevData.contact.extra];
      newExtra[index] = { contact_type: type, contact_value: value };
      return {
        ...prevData,
        contact: {
          ...prevData.contact,
          extra: newExtra,
        },
      };
    });
  };
  const delete_contact_extra_row = (index) => {
    setFormData((prevData) => {
      const newExtra = [...prevData.contact.extra];
      newExtra.splice(index, 1);
      return {
        ...prevData,
        contact: {
          ...prevData.contact,
          extra: newExtra,
        },
      };
    });
  };
  const get_education_row = (index) => {
    if (formData && formData.education && index < formData.education.length) {
      return formData.education[index];
    } else {
      return null;
    }
  };
  const add_education_row = (
    degree,
    gpa_grade,
    institution,
    specialization,
    startDate,
    endDate
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        {
          degree: degree || "",
          gpa_grade: gpa_grade || "",
          institution: institution || "",
          specialization: specialization || "",
          startDate: startDate || null,
          endDate: endDate || null,
        },
      ],
    }));
  };
  const edit_education_row = (
    index,
    degree,
    gpa_grade,
    institution,
    specialization,
    startDate,
    endDate
  ) => {
    setFormData((prevData) => {
      const newEducation = [...prevData.education];
      newEducation[index] = {
        degree: degree || "",
        gpa_grade: gpa_grade || "",
        institution: institution || "",
        specialization: specialization || "",
        startDate: startDate || null,
        endDate: endDate || null,
      };
      return {
        ...prevData,
        education: newEducation,
      };
    });
  };
  const delete_education_row = (index) => {
    setFormData((prevData) => {
      const newEducation = [...prevData.education];
      newEducation.splice(index, 1);
      return {
        ...prevData,
        education: newEducation,
      };
    });
  };
  const get_experience_row = (index) => {
    if (formData && formData.experience && index < formData.experience.length) {
      return formData.experience[index];
    } else {
      return null;
    }
  };
  const add_experience_row = (
    company,
    role,
    location,
    description,
    startDate,
    endDate
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      experience: [
        ...prevData.experience,
        {
          company: company || "",
          role: role || "",
          location: location || "",
          description: description || "",
          startDate: startDate || null,
          endDate: endDate || null,
        },
      ],
    }));
  };
  const edit_experience_row = (
    index,
    company,
    role,
    location,
    description,
    startDate,
    endDate
  ) => {
    setFormData((prevData) => {
      const newExperience = [...prevData.experience];
      newExperience[index] = {
        company: company || "",
        role: role || "",
        location: location || "",
        description: description || "",
        startDate: startDate || null,
        endDate: endDate || null,
      };
      return {
        ...prevData,
        experience: newExperience,
      };
    });
  };
  const delete_experience_row = (index) => {
    setFormData((prevData) => {
      const newExperience = [...prevData.experience];
      newExperience.splice(index, 1);
      return {
        ...prevData,
        experience: newExperience,
      };
    });
  };
  /* { contact } ----------------------------------------------------------------------------- */

  return (
    <ProfileSectionContext.Provider
      value={{
        formData,
        resumeOnFocus,
        setResumeOnFocus,
        onNameCardEdit,
        setOnNameCardEdit,

        update_cell,
        update_email,
        add_contact_extra_row,
        update_contact_extra_row,
        delete_contact_extra_row,

        get_education_row,
        add_education_row,
        edit_education_row,
        delete_education_row,

        get_experience_row,
        add_experience_row,
        edit_experience_row,
        delete_experience_row,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <NameCard context={"profile_section"}/>
      </div>
    </ProfileSectionContext.Provider>
  );
};

export default ProfileSection;
export { ProfileSectionContext };
