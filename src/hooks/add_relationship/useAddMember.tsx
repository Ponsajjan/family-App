import { useToast } from '@/components/Toast';
import { AddRelationDefaultFormValue } from '@/types/add__edit/add_relationship/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

interface AddMemberPropType {
    selectedMemberId: number | null | undefined;
}
function useAddMember({selectedMemberId}: AddMemberPropType) {
    const [memberloading, setMemberloading] = useState(false);
    const [descendant, setDescendant] = useState<boolean | null>(null);
    const [selectedMemberData, setSelectedMemberData] = useState(AddRelationDefaultFormValue);
    const [excludeMemberRelation, setExcludeMemberRelation] = useState<number[]>([]);
    const [pendingVerification, setPendingVerification] = useState<number>(0)
    const router = useRouter(); 
    const toast = useToast();

    useEffect(() => {
        if (selectedMemberId) {
            const fetchMember = async () => {
                try {
                    setMemberloading(true)
                    const response = await fetch(`/api/addRelationship/${selectedMemberId}`,
                        {
                            method: 'GET',
                            headers: { 
                              'Content-Type': 'application/json'
                            },
                        }
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch member details');
                    }
                    const { data } = await response.json();
                    
                    const formatedDbData = {
                        id: data.id || undefined,
                        name:  data.name || undefined,
                        gender: data.gender || undefined,
                        verified: data.verified,
                        partner: data.partner ? {id: data.partner.id, name: data.partner.name} : null,
                        children: data.childrenData ? data.childrenData : [],
                    }

                    // Update states
                    setDescendant(data.descendant)
                    setSelectedMemberData(formatedDbData);
                    setExcludeMemberRelation(data.excludeIds);
                    setPendingVerification(data.pendingVerification)
                } catch (error: any) {
                    toast?.show(error.message || "Error fetching member details", "error", 5000)
                    router.push('/add_edit');
                } finally {
                    setMemberloading(false)
                }
            }
            fetchMember()
        } else {
            setMemberloading(false)
            setDescendant(null)
            setSelectedMemberData(AddRelationDefaultFormValue)
            setExcludeMemberRelation([])
            setPendingVerification(0)
        }
    }, [selectedMemberId, router, toast]);
    return {
        memberloading,
        descendant,
        selectedMemberData,
        excludeMemberRelation,
        pendingVerification
    }
}

export default useAddMember