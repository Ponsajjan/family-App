interface Member {
    id: string;
    name: string;
}
export interface AddRelationFormValuesType {
    id: number | undefined;
    name: string | undefined;
    gender: string | undefined;
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