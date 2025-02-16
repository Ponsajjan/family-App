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

export const AddRelationDefaultFormValue: AddRelationFormValuesType = {
    id: undefined,
    name: undefined,
    gender: undefined,
    partner: null,
    children: [],
};