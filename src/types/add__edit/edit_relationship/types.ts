interface Member {
    id: number | null;
    name: string;
    order: number;
}

interface Children {
    id: number | null;
    order: number;
}

export interface EditRelationshipValueTypes {
    id: number | null
    name: string | null;
    gender: string | undefined;
    partner: Member | null;
    children: Member[];
    hasVerified: boolean;
    pendingVerification: number;
  }

export interface DeleteValueTypes {
    partnerId: number[] | null;
    childrenId: Children[] | null;
}

export const editRelationshipDefaultFormValue: EditRelationshipValueTypes = {
    id: null,
    name: null,
    gender: undefined,
    partner: null,
    children: [],
    hasVerified: false,
    pendingVerification: 0
};

export const editRelationshipDefaultDeleteValue: DeleteValueTypes = {
    partnerId: null,
    childrenId: [],
};
