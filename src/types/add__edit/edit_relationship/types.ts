interface Member {
    id: number | null;
    name: string;
}

export interface EditRelationshipValueTypes {
    id: number | null
    name: string | null;
    gender: string | undefined;
    partner: Member | null;
    children: Member[];
    hasVerified: boolean
  }

export interface DeleteValueTypes {
    partnerId: number[] | null;
    childrenId: number[] | null;
}

export const editRelationshipDefaultFormValue: EditRelationshipValueTypes = {
    id: null,
    name: null,
    gender: undefined,
    partner: null,
    children: [],
    hasVerified: false
};

export const editRelationshipDefaultDeleteValue: DeleteValueTypes = {
    partnerId: null,
    childrenId: [],
};
