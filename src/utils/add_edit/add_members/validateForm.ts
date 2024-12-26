import { AddMemberFormValueTypes, AddMemberFormErrorTypes } from "@/types/add__edit/add_member/types";

export const validateAddMemberForm = (formData:AddMemberFormValueTypes) => {
    const errorMessage: AddMemberFormErrorTypes = {};
  
    if (!formData.name) errorMessage.name = "Name is required";
    if (formData.name == 'undefined' || formData.name == 'Undefined') errorMessage.name = "Can not use this nane";
    if (formData.gender === undefined) errorMessage.gender = "Choose gender";
    if (formData.descendant === undefined) errorMessage.descendant = "Choose descendance";
    if (formData.birth_date && !formData.birth_month) errorMessage.birth_date = "Date of birth requires a month";
    if (formData.birth_month && !formData.birth_date) errorMessage.birth_month = "Date of birth requires a date";
    if (formData.birth_year && (!formData.birth_month || !formData.birth_date)) 
      errorMessage.birth_year = "Date and month are required";
  
    if (formData.deceased) {
      if (formData.death_date && (!formData.death_month || !formData.death_year)) 
        errorMessage.death_date = "Month and year are required";
      if (formData.death_month && !formData.death_year) errorMessage.death_month = "Death anniversary requires a year";
      if (formData.death_year && !formData.death_month) errorMessage.death_year = "Death anniversary requires a month";
    }
  
    return errorMessage;
  };