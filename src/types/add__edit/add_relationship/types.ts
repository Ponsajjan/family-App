interface Member {
    id: number;
    name: string;
}

interface Children {
    id: number;
    name: string;
    verified: boolean;
    order: number;
}

interface Partner {
    id: number;
    name: string;
    verified: boolean;
}
export interface AddRelationFormValuesType {
    id: number | undefined;
    name: string | undefined;
    gender?: 'Male' | 'Female' | null;
    partner: Member | null;
    verified: boolean;
    children: Children[];
}

export interface AddRelationPartnerFormValuesType {
    id: number | undefined;
    name: string | undefined;
    gender?: 'Male' | 'Female' | null;
    partners: Partner[] | null;
    verified: boolean;
    children: Children[];
}

export interface memberListConstrainType {
    gender: 'Male' | 'Female' | null | undefined;
    excludeId: number[],
    descendant: boolean | null
}

export const AddRelationDefaultFormValue: AddRelationFormValuesType = {
    id: undefined,
    name: undefined,
    gender: undefined,
    partner: null,
    verified: false,
    children: [],
};

export const AddRelationMemberValue: AddRelationPartnerFormValuesType = {
    id: undefined,
    name: undefined,
    gender: undefined,
    partners: [],
    verified: false,
    children: [],
};