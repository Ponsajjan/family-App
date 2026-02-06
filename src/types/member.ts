export interface EachMember {
    id: number;
    name: string;
}

export interface Member {
    id: number;
    name: string;
    gender: 'Male' | 'Female' | 'Letter';
    verified: boolean;
    father: EachMember | null;
    mother: EachMember | null;
    children: EachMember[];
    partner?: { name: string } | null;
    birthYear?: number;
    parentNames?: string;
    phoneNumber?: string;
}

export interface MembersResponse {
    data: Member[];
    totalCount: number;
    mainMemberId?: number;
}
