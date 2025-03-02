export interface NewLoginFormValueTypes {
    id?: string;
    name: string;
    gender: "Male" | "Female" | undefined;
    birth_date: string | null;
    birth_month: string | null;
    birth_year: string | null;
    death_date: string | null;
    death_month: string | null;
    death_year: string | null;
    phone_number: string;
    occupation: string;
    education: string;
    address: string;
    father: string;
    mother: string;
    siblings: string;
    member_password: string,
    moderator_password: string,
}

export interface NewLoginFormErrorTypes { 
    name?: string; 
    gender?: string; 
    birth_day?: string; 
    death_day?: string;
    password?: string;
  }

export const NewLoginDefaultFormValue: NewLoginFormValueTypes = {
    id: '',
    name: '',
    gender: undefined,
    birth_date: null,
    birth_month: null,
    birth_year: null,
    death_date: null,
    death_month: null,
    death_year: null,
    phone_number: '',
    occupation: '',
    education: '',
    address: '',
    father: '',
    mother: '',
    siblings: '',
    member_password: '',
    moderator_password: '',
};

export const NewLoginDefaultErrorValue: NewLoginFormErrorTypes = { 
    name: '',
    gender: '',
    birth_day: '',
    death_day: '',
    password: '',
  };