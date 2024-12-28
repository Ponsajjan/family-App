import { useToast } from '@/components/Toast';
import { AddRelationDefaultFormValue } from '@/types/add__edit/add_relationship/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

interface AddMemberPropType {
    selectedMemberId: number | null | undefined;
}
function useAddMember({selectedMemberId}: AddMemberPropType) {
    const [memberloading, setMemberloading] = useState(false);
    const [descendant, setDescendant] = useState<any>(null);
    const [selectedMemberData, setSelectedMemberData] = useState(AddRelationDefaultFormValue);
    const [excludeMemberRelation, setExcludeMemberRelation] = useState<number[]>([]);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        if (selectedMemberId) {
            const fetchUser = async () => {
                try {
                    setMemberloading(true)
                    const response = await fetch(`/api/addRelationship/${selectedMemberId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user details');
                    }
                    const { data } = await response.json();
                    const dbData = data[0];
                    // Extract sibling and children data
                    const siblingData = [new Set([
                    ...(Array.isArray(dbData.father?.fatherOf) ? dbData.father.fatherOf : []),
                    ...(Array.isArray(dbData.mother?.motherOf) ? dbData.mother.motherOf : []),
                    ])];
                    const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

                    const formatedDbData = {
                        id: dbData.id || undefined,
                        name:  dbData.name || undefined,
                        gender: dbData.gender || undefined,
                        partner: dbData.partner ? {id: dbData.partner.id, name: dbData.partner.name} : null,
                        children: childrenData ? childrenData : [],
                    }
                    // Update states
                    setDescendant(dbData.descendant)
                    setSelectedMemberData(formatedDbData);

                    const excludeIds = [
                        dbData?.id ? parseInt(dbData.id, 10) : null,
                        dbData.partner?.id ? parseInt(dbData.partner.id, 10) : null,
                        dbData.partner?.fatherId ? parseInt(dbData.partner.fatherId, 10) : null,
                        dbData.partner?.motherId ? parseInt(dbData.partner.motherId, 10) : null,
                        dbData.father?.id ? parseInt(dbData.father.id, 10) : null,
                        dbData.mother?.id ? parseInt(dbData.mother.id, 10) : null,
                        ...(siblingData ? siblingData.map((sibling: any) => parseInt(sibling.id, 10)) : []),
                        ...(childrenData ? childrenData.map((child: any) => parseInt(child.id, 10)) : []),
                    ].filter(Boolean);
                    setExcludeMemberRelation(excludeIds);
                } catch (error: any) {
                    if (toast) {
                        toast.show(error.message || "Error fetching user details", "error", 5000)
                    } else {
                        alert(error.message || 'Error fetching user details');
                    }
                    router.push('/add_edit');
                } finally {
                    setMemberloading(false)
                }
            }
            fetchUser()
        }
    }, [selectedMemberId])
    return {
        memberloading,
        descendant,
        selectedMemberData,
        excludeMemberRelation,
    }
}

export default useAddMember