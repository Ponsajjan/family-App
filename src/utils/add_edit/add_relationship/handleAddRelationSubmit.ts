import { useState } from "react";

interface UseAddRelationSubmitProps {
    combinedData: any;
    toast?: {
        show: (message: string, type: "success" | "error", duration: number) => void;
    };
    setShowList: (value: boolean) => void;
    setSelectedMemberID: (value: any) => void;
    setSelectedPartnerID: (value: any) => void;
    setRefresh: (value: (prev: boolean) => boolean) => void;
}

export function useAddRelationSubmit({
    combinedData,
    toast,
    setShowList,
    setSelectedMemberID,
    setSelectedPartnerID,
    setRefresh,
}: UseAddRelationSubmitProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent, selectedPartnerID: any) => {
        e.preventDefault();
        if (selectedPartnerID == null) {
            return;
        }

        try {
            setLoading(true);
            setShowList(false);

            const isMale = combinedData.gender === "Male";
            const isFemale = combinedData.gender === "Female";

            const memberData = {
                gender: combinedData.gender,
                partnerId: combinedData.partner?.id
                    ? parseInt(combinedData.partner.id, 10)
                    : null,
                ...(isMale && {
                    fatherOf:
                        combinedData.children?.length > 0
                            ? combinedData.children.map((child: any) => child.id)
                            : [],
                }),
                ...(isFemale && {
                    motherOf:
                        combinedData.children?.length > 0
                            ? combinedData.children.map((child: any) => child.id)
                            : [],
                }),
            };

            const response = await fetch(
                `/api/addRelationship/${combinedData.name?.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(memberData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (toast) {
                    toast.show(errorData.error || "Failed to update member", "error", 5000);
                }
                throw new Error(errorData.error || "Failed to update member");
            }

            const result = await response.json();
            console.log("Member updated successfully:", result);

            if (toast) {
                toast.show("Member updated successfully", "success", 5000);
            }

            setSelectedMemberID(null);
            setSelectedPartnerID(null);
            setRefresh((prev) => !prev);
        } catch (error: any) {
            if (toast) {
                toast.show(error.message || "Failed to update member", "error", 5000);
            } else {
                alert(error.message || "Failed to update member.");
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleSubmit };
}
