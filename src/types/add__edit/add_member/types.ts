export interface AddMemberFormValueTypes {
    name: string;
    gender: "Male" | "Female" | undefined;
    birth_date: string | null;
    birth_month: string | null;
    birth_year: string | null;
    deceased: boolean;
    death_date: string | null;
    death_month: string | null;
    death_year: string | null;
    phone_number: string;
    occupation: string;
    education: string;
    address: string;
    descendant: "Yes" | "No" | undefined;
    father: string;
    mother: string;
    siblings: string;
}

export interface AddMemberFormErrorTypes {
    name?: string,
    gender?: string,
    birth_date?: string,
    birth_month?: string,
    birth_year?: string,
    death_year?: string,
    death_month?: string,
    death_date?: string,
    descendant?: string,
}

export const AddMemberDefaultFormValue: AddMemberFormValueTypes = {
    name: '',
    gender: undefined,
    birth_date: null,
    birth_month: null,
    birth_year: null,
    deceased: false,
    death_date: null,
    death_month: null,
    death_year: null,
    phone_number: '',
    occupation: '',
    education: '',
    address: '',
    descendant: undefined,
    father: '',
    mother: '',
    siblings: ''
};

export const AddMemberDefaultErrorValue: AddMemberFormErrorTypes = { 
    name: '',
    gender: '',
    birth_date: '',
    birth_month: '',
    birth_year: '',
    death_year: '',
    death_month: '',
    death_date: '',
    descendant: '',
  };