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
                    const dbData = data[0];
                    // // Extract sibling and children data
                    // const siblingData = [new Set([
                    //     ...(Array.isArray(dbData.father?.fatherOf) ? dbData.father.fatherOf : []),
                    //     ...(Array.isArray(dbData.mother?.motherOf) ? dbData.mother.motherOf : []),
                    // ])];
                    const childrenData = dbData.gender === 'Male' ? dbData.fatherOf : dbData.motherOf;

                    let uniqueChildren = childrenData;
                    if (childrenData.length > 0 && Array.isArray(childrenData)) {
                    // In case partner seperates and reunite no need to show children twice
                    const memberChildren = new Set(selectedMemberData.children.map((child:any) => child.id));
                    uniqueChildren = [
                        ...childrenData.filter((child) => !memberChildren.has(child.id)),
                    ];
        
                    }
                    const formatedDbData = {
                        id: dbData.id || undefined,
                        name: dbData.name || undefined,
                        gender: undefined,
                        partner: null,
                        children: uniqueChildren ? uniqueChildren : [],
                    }
        
                    setSelectedPartnerData(formatedDbData);

                    const excludeIds = [
                        dbData?.id ? parseInt(dbData.id, 10) : null,
                        dbData.father?.id ? parseInt(dbData.father.id, 10) : null,
                        dbData.mother?.id ? parseInt(dbData.mother.id, 10) : null,
                        ...(childrenData ? childrenData.map((child: any) => parseInt(child.id, 10)) : []),
                    ].filter(Boolean);
                    setExcludePartnerRelation(excludeIds);

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