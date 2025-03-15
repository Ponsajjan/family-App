import { useToast } from '@/components/Toast';
import { AddRelationDefaultFormValue } from '@/types/add__edit/add_relationship/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next';

interface AddMemberPropType {
    selectedMemberId: number | null | undefined;
}
function useAddMember({selectedMemberId}: AddMemberPropType) {
    const [memberloading, setMemberloading] = useState(false);
    const [descendant, setDescendant] = useState<any>(null);
    const [selectedMemberData, setSelectedMemberData] = useState(AddRelationDefaultFormValue);
    const [excludeMemberRelation, setExcludeMemberRelation] = useState<number[]>([]);
    const token = getCookie('token');
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
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}` 
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
                        partner: data.partner ? {id: data.partner.id, name: data.partner.name} : null,
                        children: data.childrenData ? data.childrenData : [],
                    }
                    // Update states
                    setDescendant(data.descendant)
                    setSelectedMemberData(formatedDbData);
                    setExcludeMemberRelation(data.excludeIds);
                } catch (error: any) {
                    if (toast) {
                        toast.show(error.message || "Error fetching member details", "error", 5000)
                    } else {
                        alert(error.message || 'Error fetching member details');
                    }
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
        }
    }, [selectedMemberId, router, toast])
    return {
        memberloading,
        descendant,
        selectedMemberData,
        excludeMemberRelation,
    }
}

export default useAddMember