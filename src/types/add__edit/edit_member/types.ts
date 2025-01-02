export interface EditMemberFormValueTypes {
    id: number | null,
    name: string;
    gender: 'Male' | 'Female' | undefined;
    birth_date: string | number | null;
    birth_month: string | number | null;
    birth_year: string | number | null;
    deceased: boolean;
    death_date: string | number | null;
    death_month: string | number | null;
    death_year: string | number | null;
    phone_number: string | number | null;
    occupation: string;
    education: string;
    address: string;
    descendant: string | undefined;
    father: string;
    mother: string;
    siblings: string;
};

export interface EditMemberFormErrorTypes {
    name: string
    birth_date: string,
    birth_month: string,
    birth_year: string,
    death_year: string,
    death_month: string,
    death_date: string   
}

export const EditMemberDefaultFormValue: EditMemberFormValueTypes = {
    id: null,
    name: '',
    gender: undefined,
    birth_date: null,
    birth_month: null,
    birth_year: null,
    deceased: false,
    death_date: null,
    death_month: null,
    death_year: null,
    phone_number: null,
    occupation: '',
    education: '',
    address: '',
    descendant: undefined,
    father: '',
    mother: '',
    siblings: ''
};

export const EditMemberDefaultFormErrorValue: EditMemberFormErrorTypes = {
    name: '',
    birth_date: '',
    birth_month: '',
    birth_year: '',
    death_year: '',
    death_month: '',
    death_date: ''
};

export interface AllowedEditTypes {
    dataLocked: boolean,
    editGender: boolean,
    editDescendant: boolean
}
export const DefaultAllowedEdits: AllowedEditTypes = {
    dataLocked: false,
    editGender: false,
    editDescendant: false
}