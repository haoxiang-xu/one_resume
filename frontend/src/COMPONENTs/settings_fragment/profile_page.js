import { useContext, useState, useEffect, createContext } from "react";

/* { Contexts } -------------------------------------------------------------------------------------------------------------- */
import { DataContext } from "../../CONTAINERs/data/context";
import { RequestContext } from "../../CONTAINERs/request/container";
/* { Contexts } -------------------------------------------------------------------------------------------------------------- */

import NameCard from "../draft_resume_form/name_card";

const ProfilePageContext = createContext();

const ProfilePage = () => {
  const { userInfo } = useContext(DataContext);
  const { update_user_info } = useContext(RequestContext);

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
    setFormData((prevData) => {
      const newFormData = {
        ...prevData,
        contact: {
          ...prevData.contact,
          cell: value,
        },
      };
      update_user_info(newFormData);
      return newFormData;
    });
  };
  const update_email = (value) => {
    setFormData((prevData) => {
      const newFormData = {
        ...prevData,
        contact: {
          ...prevData.contact,
          email: value,
        },
      };
      update_user_info(newFormData);
      return newFormData;
    });
  };
  const add_contact_extra_row = (type, value) => {
    setFormData((prevData) => {
      const newFormData = {
        ...prevData,
        contact: {
          ...prevData.contact,
          extra: [
            ...prevData.contact.extra,
            { contact_type: type, contact_value: value },
          ],
        },
      };
      update_user_info(newFormData);
      return newFormData;
    });
  };
  const update_contact_extra_row = (index, type, value) => {
    setFormData((prevData) => {
      const newExtra = [...prevData.contact.extra];
      newExtra[index] = { contact_type: type, contact_value: value };
      const newFormData = {
        ...prevData,
        contact: {
          ...prevData.contact,
          extra: newExtra,
        },
      };
      update_user_info(newFormData);
      return newFormData;
    });
  };
  const delete_contact_extra_row = (index) => {
    setFormData((prevData) => {
      const newExtra = [...prevData.contact.extra];
      newExtra.splice(index, 1);
      const newFormData = {
        ...prevData,
        contact: {
          ...prevData.contact,
          extra: newExtra,
        },
      };
      update_user_info(newFormData);
      return newFormData;
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
    setFormData((prevData) => {
      const newFormData = {
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
      };
      update_user_info(newFormData);
      return newFormData;
    });
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
      const newFormData = {
        ...prevData,
        education: newEducation,
      };
      update_user_info(newFormData);
      return newFormData;
    });
  };
  const delete_education_row = (index) => {
    setFormData((prevData) => {
      const newEducation = [...prevData.education];
      newEducation.splice(index, 1);
      const newFormData = {
        ...prevData,
        education: newEducation,
      };
      update_user_info(newFormData);
      return newFormData;
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
    setFormData((prevData) => {
      const newFormData = {
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
      };
      update_user_info(newFormData);
      return newFormData;
    });
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
      const newFormData = {
        ...prevData,
        experience: newExperience,
      };
      update_user_info(newFormData);
      return newFormData;
    });
  };
  const delete_experience_row = (index) => {
    setFormData((prevData) => {
      const newExperience = [...prevData.experience];
      newExperience.splice(index, 1);
      const newFormData = {
        ...prevData,
        experience: newExperience,
      };
      update_user_info(newFormData);
      return newFormData;
    });
  };
  /* { contact } ----------------------------------------------------------------------------- */

  return (
    <ProfilePageContext.Provider
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
        <NameCard context={"profile_page"} />
      </div>
    </ProfilePageContext.Provider>
  );
};

export default ProfilePage;
export { ProfilePageContext };
