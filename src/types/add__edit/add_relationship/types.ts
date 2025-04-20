interface Member {
    id: number;
    name: string;
}

interface Children {
    id: number;
    name: string;
    verified: boolean;
    // order: number;
}
export interface AddRelationFormValuesType {
    id: number | undefined;
    name: string | undefined;
    gender?: 'Male' | 'Female' | null;
    partner: Member | null;
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