export interface EditMemberFormValueTypes {
    id: number | null,
    name: string;
    gender: 'Male' | 'Female' | undefined;
    verified: boolean;
    pendingVerification: number;
    birth_date: string | null;
    birth_month: string | null;
    birth_year: string | null;
    deceased: boolean;
    death_date: string | null;
    death_month: string | null;
    death_year: string | null;
    phone_number: string | null;
    occupation: string;
    education: string;
    address: string;
    descendant: string | undefined;
    father: string;
    mother: string;
    siblings: string;
};

export interface EditMemberFormErrorTypes {
    name?: string
    birth_day?: string,
    death_day?: string,  
}

export const EditMemberDefaultFormValue: EditMemberFormValueTypes = {
    id: null,
    name: '',
    gender: undefined,
    verified: false,
    pendingVerification: 0,
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
    birth_day: '',
    death_day: '',
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