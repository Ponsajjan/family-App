import { LinkButtonSolid } from "@/components/Button";
import Container from "@/components/Container"
import { HoldButton } from "@/components/HoldButton"
import { useToast } from "@/components/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthEntry, Moderator } from "@/types/admin/types"
import { CopyLink } from "@/utils/Icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Details({selectedMember}: {selectedMember: AuthEntry}) {
    const toast = useToast();
    const router = useRouter();
    const {logout} = useAuth();
    const [deleting, setDeleting] = useState(false);
    const [moderators, setModerators] = useState<Moderator[]>([]);
    const [editingModerator, setEditingModerator] = useState<{ id: number | null; index: number | null }>({ id: null, index: null });
    const [newModerator, setNewModerator] = useState({ moderatorName: "", moderatorContact: "" });
    const [editModerator, setEditModerator] = useState({ moderatorName: "", moderatorContact: "" });
    const [addingModerator, setAddingModerator] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setModerators(selectedMember.moderators)
    }, [selectedMember])
    const copyToClipboard = (text: string, type: string) => {
        const copyText = `Website: www.test.com\nCredential for: ${selectedMember.credential} family calendar \n${type}: ${text}`;
        
        navigator.clipboard.writeText(copyText).then(() => {
            toast?.show(`${type} copied to clipboard!`, "success", 2000);
        }).catch(err => {
            toast?.show("Failed to copy to clipboard", "error", 3000);
        });
    };

    const deleteRecord = async (id: number) => {
        try {
            setDeleting(true);
            const response = await fetch(`/api/admin/edit_login/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
    
            if (!response.ok) {
                if (response.status === 401) {
                    logout();
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete member");
            }
    
            const result = await response.json();
            toast?.show(result.message, "success", 5000);
            router.refresh();
        } catch (error: any) {
            toast?.show(error.message || "Failed to delete member", "error", 5000);
        } finally {
            setDeleting(false);
        }
    };

    const handleAddModerator = async () => {
        if (!newModerator.moderatorName.trim() || !newModerator.moderatorContact.trim()) {
            toast?.show("Name and contact number are required.", "error", 5000);
            return;
        }
    
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/moderator`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    moderatorName: newModerator.moderatorName.trim(),
                    moderatorContact: newModerator.moderatorContact.trim(),
                    authId: selectedMember.id,
                }),
            });
    
            if (response.status === 401) {
                logout();
                return;
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add moderator");
            }
    
            const result = await response.json();
            toast?.show("Moderator added successfully", "success", 5000);
            
            // Add the new moderator to the list
            const newModeratorData = {
                id: result.id,
                name: newModerator.moderatorName.trim(),
                contactNumber: newModerator.moderatorContact.trim()
            };
            
            setModerators([...moderators, newModeratorData]);
            setNewModerator({ moderatorName: "", moderatorContact: "" });
            setAddingModerator(false);
    
        } catch (error: any) {
            toast?.show(error.message || "Failed to add moderator", "error", 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleEditModerator = (index: number) => {
        const moderator = moderators[index];
        setEditingModerator({ id: moderator.id, index });
        setEditModerator({ moderatorName: moderator.name, moderatorContact: moderator.contactNumber });
    };

    const handleSaveEditModerator = async () => {
        if (!editingModerator.id || editingModerator.index === null) return;
        
        if (!editModerator.moderatorName.trim() || !editModerator.moderatorContact.trim()) {
            toast?.show("Name and contact number are required.", "error", 5000);
            return;
        }
        
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/moderator/${editingModerator.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    moderatorName: editModerator.moderatorName.trim(),
                    moderatorContact: editModerator.moderatorContact.trim(),
                    authId: selectedMember.id,
                }),
            });
    
            if (response.status === 401) {
                logout();
                return;
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update moderator");
            }
    
            const result = await response.json();
            toast?.show("Moderator updated successfully", "success", 5000);
            
            // Update the moderator in the list
            const updatedModerators = [...moderators];
            updatedModerators[editingModerator.index!] = {
                ...updatedModerators[editingModerator.index!],
                name: editModerator.moderatorName.trim(),
                contactNumber: editModerator.moderatorContact.trim()
            };
            
            setModerators(updatedModerators);
            setEditingModerator({ id: null, index: null });
    
        } catch (error: any) {
            toast?.show(error.message || "Failed to update moderator", "error", 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteModerator = async (id: number, index: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/moderator/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
    
            if (response.status === 401) {
                logout();
                return;
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete moderator");
            }
    
            toast?.show("Moderator deleted successfully", "success", 5000);
            
            // Remove the moderator from the list
            const updatedModerators = moderators.filter((_, i) => i !== index);
            setModerators(updatedModerators);
            
        } catch (error: any) {
            toast?.show(error.message || "Failed to delete moderator", "error", 5000);
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditingModerator({ id: null, index: null });
    };

    const cancelAdd = () => {
        setAddingModerator(false);
        setNewModerator({ moderatorName: "", moderatorContact: "" });
    };

    return (
        <Container className="p-4 text-text_color">
            <h2 className="text-2xl font-bold mb-3">{selectedMember.credential}</h2>
            
            <div className="space-y-3 pl-4 border-l-4 border-text_color/30 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <span className="font-medium">Member Password:</span>
                        <span className="ml-2">{selectedMember.memberPassword}</span>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(selectedMember.memberPassword, "Member password")}
                        className="p-1 hover:bg-field_color rounded-md transition-colors"
                        title="Copy member password"
                    >
                    <CopyLink />
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <span className="font-medium">Moderator Password:</span>
                        <span className="ml-2">{selectedMember.moderatorPassword}</span>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(selectedMember.moderatorPassword, "Moderator password")}
                        className="p-1 hover:bg-field_color rounded-md transition-colors"
                        title="Copy moderator password"
                    >
                    <CopyLink />
                    </button>
                </div>
            </div>

            <div className="border border-border_color rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">
                    Moderators
                </h3>
                <div className="space-y-3">
                    {moderators.map((moderator, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border_color rounded-md">
                            {editingModerator.index === index ? (
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={editModerator.moderatorName}
                                        onChange={(e) => setEditModerator({...editModerator, moderatorName: e.target.value})}
                                        className="w-full p-2 mb-2 border rounded"
                                        placeholder="Moderator Name"
                                        disabled={loading}
                                    />
                                    <input
                                        type="text"
                                        value={editModerator.moderatorContact}
                                        onChange={(e) => setEditModerator({...editModerator, moderatorContact: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        placeholder="Contact Number"
                                        disabled={loading}
                                    />
                                    <div className="flex mt-2 space-x-2">
                                        <button 
                                            onClick={handleSaveEditModerator}
                                            disabled={loading}
                                            className="px-3 bg-accent_color md:hover:bg-accent_color_hover text-accent_contrast rounded disabled:opacity-50"
                                        >
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                        <button 
                                            onClick={cancelEdit}
                                            disabled={loading}
                                            className="px-3 bg-field_color md:hover:bg-field_hover border-2 border-accent_color text-text_color rounded disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="font-medium">{moderator.name}</div>
                                        <div className="text-sm text-gray-600">{moderator.contactNumber}</div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleEditModerator(index)}
                                            disabled={loading}
                                            className="px-3 bg-accent_color md:hover:bg-accent_color_hover text-accent_contrast rounded disabled:opacity-50"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteModerator(moderator.id, index)}
                                            disabled={loading}
                                            className="px-3 bg-field_color md:hover:bg-field_hover border-2 border-accent_color text-text_color rounded disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {moderators.length === 0 && !addingModerator && (
                        <p className="text-text_color/60 text-center py-4">No moderators assigned</p>
                    )}
                    {addingModerator ? (
                        <div className="p-3 border border-border_color rounded-md">
                            <input
                                type="text"
                                value={newModerator.moderatorName}
                                onChange={(e) => setNewModerator({...newModerator, moderatorName: e.target.value})}
                                className="w-full p-2 mb-2 border rounded"
                                placeholder="Moderator Name"
                                disabled={loading}
                            />
                            <input
                                type="text"
                                value={newModerator.moderatorContact}
                                onChange={(e) => setNewModerator({...newModerator, moderatorContact: e.target.value})}
                                className="w-full p-2 border rounded"
                                placeholder="Contact Number"
                                disabled={loading}
                            />
                            <div className="flex mt-2 space-x-2">
                                <button 
                                    onClick={handleAddModerator}
                                    disabled={loading}
                                    className="px-3 bg-accent_color md:hover:bg-accent_color_hover text-accent_contrast rounded disabled:opacity-50"
                                >
                                    {loading ? "Adding..." : "Add"}
                                </button>
                                <button 
                                    onClick={cancelAdd}
                                    disabled={loading}
                                    className="px-3 bg-field_color md:hover:bg-field_hover border-2 border-accent_color text-text_color rounded disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setAddingModerator(true)}
                            disabled={loading}
                            className="w-full p-3 border border-border_color rounded-md text-center hover:bg-gray-100 disabled:opacity-50"
                        >
                            Add Moderator +
                        </button>
                    )}
                </div>
            </div>

            <div className='flex flex-col mt-8 gap-2'>
                <LinkButtonSolid 
                    disabled={loading || deleting} 
                    buttonText='Edit Credentials' 
                    linkto={`/admin/edit_login/${selectedMember.id}`}
                />
                <HoldButton 
                    disabled={deleting || loading} 
                    type='outline' 
                    buttonText={deleting ? 'Deleting...' : 'Delete Credential'} 
                    onClick={() => deleteRecord(selectedMember.id)} 
                />
            </div>
        </Container>
    )
}

export default Details