import { AddMemberFormValueTypes, AddMemberFormErrorTypes } from "@/types/add__edit/add_member/types";
import validator from "validator";

export const validateAddMemberForm = (formData:AddMemberFormValueTypes) => {
    const errorMessage: AddMemberFormErrorTypes = {};
  
    if (!formData.name) errorMessage.name = "Name is required";
    if (formData.name == 'undefined' || formData.name == 'Undefined') errorMessage.name = "Can not use this nane";
    
    if (formData.gender === undefined) errorMessage.gender = "Choose gender";
    
    if (formData.descendant === undefined) errorMessage.descendant = "Choose descendance";
    
    // Utility function for validating dates
    function validateDate(day:string | null, month:string, year:string | null, format = "DD-MM-YYYY") {
      if ((day && day?.length !== 2) || month?.length !== 2 || (year && year?.length !== 4)) {
        return `Maintain DD${year ? ", MM, YYYY" : ", MM"} format. Example: ${year ? "01 01 2000" : "01 01"}`;
      }

      const daysInMonth = new Date(2020, parseInt(month, 10), 0).getDate(); // 2020 is a leap year
      if (day && (parseInt(day, 10) > daysInMonth)) {
        return `${day} is not possible in month ${month}`;
      }

      if (day && year && !validator.isDate(`${day}-${month}-${year}`, { format, strictMode: true })) {
        return "Enter a valid date!";
      }
      return undefined;
    }

    // Birth date validation
    if (formData.birth_date || formData.birth_month || formData.birth_year) {
      if (!formData.birth_month || !formData.birth_date) {
        errorMessage.birth_day = "Date and month are required";
      } else {
        const error =
          validateDate(
            formData.birth_date,
            formData.birth_month,
            formData.birth_year
          );
        if (error) {
          errorMessage.birth_day = error
        }
      }
    }

    // Death date validation
    if (formData.deceased && (formData.death_date || formData.death_month || formData.death_year)) {
      if (!formData.death_year || !formData.death_month) {
        errorMessage.death_day = "Death anniversary requires a month and year";
      } else {
        const error =
          validateDate(
            formData.death_date,
            formData.death_month,
            formData.death_year
          );
        if (error) {
          errorMessage.death_day = error
        }
      }
    }

    function validatePhoneNumber(phone: string) {
      const allowedChars = /^[0-9()+\-\s]+$/;
        
      if (!allowedChars.test(phone)) {
        return "Enter valid phone number";
      }

      // Ensure that every '+', '-', '(', ')' is followed by a digit
      const followedByDigit = /[+\-()\s](?!\d)/;
      if (followedByDigit.test(phone)) {
        return "Enter valid phone number";
      }
    
      const digitsOnly = phone.replace(/\D/g, ""); // Strip non-digits
      if (digitsOnly.length < 8 || digitsOnly.length > 15) {
        return "Enter valid phone number";
      }
    
      return undefined; // valid
    }

    if (formData.phone_number) {
      const error = validatePhoneNumber(formData.phone_number?.trimEnd())

      if (error) {
        errorMessage.phone_number = error
      }
    } 
  
    return errorMessage;
  };