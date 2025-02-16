interface Member {
    id: number;
    name: string;
}
export interface AddRelationFormValuesType {
    id: number | undefined;
    name: string | undefined;
    gender?: 'Male' | 'Female' | null;
    partner: Member | null;
    children: Member[];
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
    children: [],
};