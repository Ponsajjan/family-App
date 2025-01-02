import { AddMemberFormValueTypes, AddMemberFormErrorTypes } from "@/types/add__edit/add_member/types";
import validator from "validator";

export const validateAddMemberForm = (formData:AddMemberFormValueTypes) => {
    const errorMessage: AddMemberFormErrorTypes = {};
  
    if (!formData.name) errorMessage.name = "Name is required";
    if (formData.name == 'undefined' || formData.name == 'Undefined') errorMessage.name = "Can not use this nane";
    
    if (formData.gender === undefined) errorMessage.gender = "Choose gender";
    
    if (formData.descendant === undefined) errorMessage.descendant = "Choose descendance";
    
    if (!formData.birth_month || !formData.birth_date) errorMessage.birth_day = "Date and month are required";
    if (formData.birth_date && formData.birth_month && formData.birth_year) {
      if (validator.isDate(`${formData.birth_date}-${formData.birth_month}-${formData.birth_year}`, {
            format: "DD-MM-YYYY",
            strictMode: true
        })
      ) {
        errorMessage.birth_day = "";;
      } else {
          errorMessage.birth_day = "Enter Valid Date!";
      }
    }
  if (formData.birth_date && formData.birth_month) {
    const month = parseInt(formData.birth_month);
    const date = parseInt(formData.birth_date);
    const daysInMonth = new Date(2020, month, 0).getDate(); // 2020 is a leap year

    if (date > daysInMonth) {
    errorMessage.birth_day = `Invalid date: ${date} is not possible in month ${month}`;
    }
  }
  
    if (formData.deceased) {
      if (formData.death_date && (!formData.death_month || !formData.death_year)) 
        errorMessage.death_day = "Month and year are required";
      if (formData.death_month && !formData.death_year) errorMessage.death_day = "Death anniversary requires a year";
      if (formData.death_year && !formData.death_month) errorMessage.death_day = "Death anniversary requires a month";
    }
  
    return errorMessage;
  };