interface Partners {
    id: number | null;
    name: string;
}

interface Children {
    id: number | null;
    name: string;
    order: number;
}

interface DeleteChildren {
    id: number | null;
    order: number;
}

export interface EditRelationshipValueTypes {
    id: number | null
    name: string | null;
    gender: string | undefined;
    partners: Partners[];
    children: Children[];
    hasVerified: boolean;
    pendingVerification: number;
  }

export interface DeleteValueTypes {
    partnersId: Partners[] | null;
    childrenId: DeleteChildren[] | null;
}

export const editRelationshipDefaultFormValue: EditRelationshipValueTypes = {
    id: null,
    name: null,
    gender: undefined,
    partners: [],
    children: [],
    hasVerified: false,
    pendingVerification: 0
};

export const editRelationshipDefaultDeleteValue: DeleteValueTypes = {
    partnersId: [],
    childrenId: [],
};
