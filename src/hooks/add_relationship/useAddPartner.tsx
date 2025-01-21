import { useToast } from '@/components/Toast';
import { AddRelationDefaultFormValue } from '@/types/add__edit/add_relationship/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

interface AddPartnerPropType {
    selectedPartnerId: number | null | undefined;
    selectedMemberData: any
}

function useAddPartner({selectedPartnerId, selectedMemberData}:AddPartnerPropType) {
    const [patnerLoading, setPartnerLoading] = useState(false);
    const [selectedPartnerData, setSelectedPartnerData] = useState<any>([]);
    const [excludePartnerRelation, setExcludePartnerRelation] = useState<number[]>([]);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        if (selectedPartnerId) {
            const fetchPartner = async () => {
                try {
                    setPartnerLoading(true)
                    const response = await fetch(`/api/addRelationship/${selectedPartnerId}`);
                    if (!response.ok) throw new Error('Failed to fetch user details');
                
                    const { data } = await response.json();
                    
                    let uniqueChildren = data.childrenData;
                    if (data.childrenData.length > 0 && Array.isArray(data.childrenData)) {
                    // In case partner seperates and reunites with the same member
                    const memberChildren = new Set(selectedMemberData.children.map((child:any) => child.id));
                    uniqueChildren = [
                        ...data.childrenData.filter((child: {id: number, name:string}) => !memberChildren.has(child.id)),
                    ];
        
                    }
                    const formatedDbData = {
                        id: data.id || undefined,
                        name: data.name || undefined,
                        gender: undefined,
                        partner: null,
                        children: uniqueChildren ? uniqueChildren : [],
                    }
        
                    setSelectedPartnerData(formatedDbData);
                    setExcludePartnerRelation(data.excludeIds);

                } catch (error: any) {
                    if (toast) {
                        toast.show(error.message || "Error fetching user details", "error", 5000)
                    } else {
                        alert(error.message || 'Error fetching user details');
                    }
                    router.push('/add_edit');
                } finally {
                    setPartnerLoading(false)
                }
            }

            fetchPartner()
        } else {
            setPartnerLoading(false);
            setSelectedPartnerData(AddRelationDefaultFormValue);
            setExcludePartnerRelation([]);
        }

    }, [selectedPartnerId])
    return {
        patnerLoading,
        selectedPartnerData,
        excludePartnerRelation
    }
}

export default useAddPartner