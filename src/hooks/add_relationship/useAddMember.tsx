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
                    
                    const formatedDbData = {
                        id: data.id || undefined,
                        name:  data.name || undefined,
                        gender: data.gender || undefined,
                        partner: data.partner ? {id: data.partner.id, name: data.partner.name} : null,
                        children: data.childrenData ? data.childrenData : [],
                    }
                    // Update states
                    setDescendant(data.descendant)
                    setSelectedMemberData(formatedDbData);
                    setExcludeMemberRelation(data.excludeIds);
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
        } else {
            setMemberloading(false)
            setDescendant(null)
            setSelectedMemberData(AddRelationDefaultFormValue)
            setExcludeMemberRelation([])
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