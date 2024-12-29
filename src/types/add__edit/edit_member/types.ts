interface Member {
    id: number | null;
    name: string;
  }
export interface EditMemberFormValueTypes {
    name: Member | null;
    gender: string | undefined; // Gender is restricted to specific string literals
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
    descendant: string | undefined;
    fatherId: string,
    motherId: string,
    hasPartner: boolean;
    isParent: boolean;
    father: string;
    mother: string;
    sibling: string;
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
    name: null,
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
    fatherId: '',
    motherId: '',
    hasPartner: false,
    isParent: false,
    father: '',
    mother: '',
    sibling: ''
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