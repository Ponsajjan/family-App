import { LinkButtonSolid } from "@/components/Button";
import { getCookie } from "cookies-next";
import Container from "@/components/Container"
import { HoldButton } from "@/components/HoldButton"
import { useToast } from "@/components/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthEntry, Moderator } from "@/types/admin/types"
import { CloseIcon, Copy } from "@/utils/Icons";
import { useEffect, useState } from "react";
import { appFetch } from "@/utils/appFetch";

function Details({ selectedCredential, onDelete, openDetails }: { selectedCredential: AuthEntry, onDelete: (id: number) => void, openDetails: (val: boolean) => void }) {
    const toast = useToast();
    const { logout } = useAuth();
    const [deleting, setDeleting] = useState(false);
    const [moderators, setModerators] = useState<Moderator[]>([]);
    const [editingModerator, setEditingModerator] = useState<{ id: number | null; index: number | null }>({ id: null, index: null });
    const [newModerator, setNewModerator] = useState({ moderatorName: "", moderatorContact: "" });
    const [editModerator, setEditModerator] = useState({ moderatorName: "", moderatorContact: "" });
    const [addingModerator, setAddingModerator] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setModerators(selectedCredential.moderators)
    }, [selectedCredential])
    const copyToClipboard = (text: string, type: string) => {
        const copyText = `Website: ${process.env.NEXT_PUBLIC_BASE_URL} \nCredential for: ${selectedCredential.mainMemberName} family calendar \n${type}: ${text}`;

        navigator.clipboard.writeText(copyText).then(() => {
            toast?.show(`${type} copied to clipboard!`, "success", 5000);
        }).catch(err => {
            toast?.show(`Failed to copy to clipboard ${err}`, "error", 5000);
        });
    };

    const deleteRecord = async (id: number | null) => {
        if (deleting || loading || id === null) return;
        try {
            setDeleting(true);
            const response = await appFetch(`/api/admin/edit_login/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
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
            // List update
            onDelete(id);
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
            const response = await appFetch(`/api/admin/moderator`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({
                    moderatorName: newModerator.moderatorName.trim(),
                    moderatorContact: newModerator.moderatorContact.trim(),
                    authId: selectedCredential.id,
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
                id: result.moderator.id,
                name: result.moderator.moderatorName,
                contactNumber: result.moderator.moderatorContact
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
        if (editingModerator.id === null || editingModerator.index === null) return;

        if (!editModerator.moderatorName.trim() || !editModerator.moderatorContact.trim()) {
            toast?.show("Name and contact number are required.", "error", 5000);
            return;
        }

        try {
            setLoading(true);
            const response = await appFetch(`/api/admin/moderator/${editingModerator.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({
                    moderatorName: editModerator.moderatorName.trim(),
                    moderatorContact: editModerator.moderatorContact.trim(),
                    authId: selectedCredential.id,
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
            setModerators(prev => {
                const updated = [...prev];
                if (editingModerator.index !== null && updated[editingModerator.index]) {
                    updated[editingModerator.index] = {
                        ...updated[editingModerator.index],
                        name: result.moderatorName || editModerator.moderatorName.trim(),
                        contactNumber: result.moderatorContact || editModerator.moderatorContact.trim()
                    };
                }
                return updated;
            });
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
            const response = await appFetch(`/api/admin/moderator/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
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

    const handleDownloadBackup = async () => {
        try {
            setLoading(true);
            const response = await appFetch(`/api/admin/backup?authId=${selectedCredential.id}`);
            if (!response.ok) throw new Error("Failed to generate backup");

            const data = await response.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            const date = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = `Backup_${selectedCredential.mainMemberName}_${date}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast?.show("Backup downloaded successfully", "success", 5000);
        } catch (error: any) {
            toast?.show(error.message || "Failed to download backup", "error", 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const backupData = JSON.parse(content);

                if (backupData.type !== "single" || backupData.authId !== selectedCredential.id) {
                    if (!confirm("This backup file doesn't seem to match this family. Are you sure you want to restore it here? This will overwrite the current family data.")) {
                        return;
                    }
                } else {
                    if (!confirm("Are you sure you want to restore this backup? This will delete all current members and relations for this family and replace them with the backup data.")) {
                        return;
                    }
                }

                setLoading(true);
                // Ensure the backup knows it's being restored to THIS family
                backupData.authId = selectedCredential.id;
                backupData.type = "single";

                const response = await appFetch(`/api/admin/backup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(backupData),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Restore failed");
                }

                toast?.show("Family data restored successfully", "success", 5000);
                window.location.reload(); // Refresh to show restored data
            } catch (error: any) {
                toast?.show(error.message || "Invalid backup file", "error", 5000);
            } finally {
                setLoading(false);
                event.target.value = ""; // Clear file input
            }
        };
        reader.readAsText(file);
    };

    return (

        <Container className="p-4 text-text_color relative">
            <div onClick={() => openDetails(false)} className='hidden md:block absolute top-0 right-0 border border-border_color rounded-md m-2 cursor-pointer'>
                <CloseIcon />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedCredential.mainMemberName}</h2>

            <div className="pl-4 border-l-4 border-text_color/30 mb-4">
                <div className="flex items-center flex-wrap w-full">
                    <div className="font-medium">Member Password:</div>
                    <div className="flex-1 flex items-center justify-between">
                        <div className="ml-2">{selectedCredential.memberPassword}</div>
                        <div
                            onClick={() => copyToClipboard(selectedCredential.memberPassword, "Member password")}
                            className="p-1 hover:bg-field_color rounded-md transition-colors"
                            title="Copy member password"
                        >
                            <Copy />
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-wrap w-full">
                    <div className="font-medium">Moderator Password:</div>
                    <div className="flex-1 flex items-center justify-between">
                        <div className="ml-2">{selectedCredential.moderatorPassword}</div>
                        <div
                            onClick={() => copyToClipboard(selectedCredential.moderatorPassword, "Moderator password")}
                            className="p-1 hover:bg-field_color rounded-md transition-colors"
                            title="Copy moderator password"
                        >
                            <Copy />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-border_color rounded-lg p-4 pt-2 mb-6">
                <h3 className="font-semibold text-lg mb-1">
                    Moderators
                </h3>
                <div className="space-y-3">
                    {moderators.map((moderator, index) => (
                        <div key={index} className="flex items-center justify-between px-3 py-2 border border-border_color rounded-md">
                            {editingModerator.index === index ? (
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={editModerator.moderatorName}
                                        onChange={(e) => setEditModerator({ ...editModerator, moderatorName: e.target.value })}
                                        className="w-full p-2 mb-2 border rounded"
                                        placeholder="Moderator Name"
                                        disabled={loading}
                                    />
                                    <input
                                        type="text"
                                        value={editModerator.moderatorContact}
                                        onChange={(e) => setEditModerator({ ...editModerator, moderatorContact: e.target.value })}
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
                        <div className="px-3 py-2 border border-border_color rounded-md">
                            <input
                                type="text"
                                value={newModerator.moderatorName}
                                onChange={(e) => setNewModerator({ ...newModerator, moderatorName: e.target.value })}
                                className="w-full p-2 mb-2 border rounded"
                                placeholder="Moderator Name"
                                disabled={loading}
                            />
                            <input
                                type="text"
                                value={newModerator.moderatorContact}
                                onChange={(e) => setNewModerator({ ...newModerator, moderatorContact: e.target.value })}
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
                            disabled={loading || deleting || editingModerator.id !== null}
                            className="w-full py-2 border border-border_color rounded-md text-center hover:bg-gray-100 disabled:opacity-50"
                        >
                            Add Moderator +
                        </button>
                    )}
                </div>
            </div>

            <div className="border border-border_color border-dashed rounded-lg p-4 pt-2 mb-8 bg-field_color/30">
                <h3 className="font-semibold text-lg mb-2">Backup & Restore</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleDownloadBackup}
                        disabled={loading || deleting}
                        className="flex-1 py-2 bg-field_color border border-border_color rounded-md hover:bg-field_hover transition-colors font-medium text-sm"
                    >
                        Download Backup
                    </button>
                    <label className={`flex-1 py-2 bg-field_color border border-border_color rounded-md hover:bg-field_hover transition-colors font-medium text-sm text-center cursor-pointer ${loading || deleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Restore Backup
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={handleRestoreBackup}
                            disabled={loading || deleting}
                        />
                    </label>
                </div>
                <p className="text-xs text-text_color/60 mt-2 italic">* Restore will overwrite all members and metadata for this family.</p>
            </div>

            <div className='flex flex-col mt-4 gap-2'>
                <LinkButtonSolid
                    disabled={loading || deleting || editingModerator.id !== null}
                    buttonText='Edit Credentials'
                    linkto={`/admin/edit_login/${selectedCredential.mainMemberId}`}
                />
                <HoldButton
                    disabled={deleting || loading || editingModerator.id !== null}
                    type='outline'
                    buttonText={deleting ? 'Deleting...' : 'Delete Credential'}
                    onClick={() => deleteRecord(selectedCredential.id)}
                />
            </div>
        </Container>

    )
}

export default Details