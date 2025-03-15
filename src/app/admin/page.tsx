'use client'

import { ButtonOutline, ButtonSolid } from "@/components/Button";
import Container from "@/components/Container";
import Input from "@/components/Input";
import { Popup } from "@/components/Popup";
import { useToast } from "@/components/Toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function ExpandableTable() {
  const toast = useToast();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [editingModerator, setEditingModerator] = useState<{ rowIndex: number; modIndex: number } | null>(null);
  const [data, setData] = useState([]);
  const [editModerator, setEditModerator] = useState({ name: "", contactNumber: "" });
  const [newModerator, setNewModerator] = useState({ name: "", contactNumber: "" });
  const router = useRouter();
  const [showPopup, setShowPopup] = useState<{ id: number | null; descendantOf: string | null }>({ id: null, descendantOf: null });
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin');
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        if (toast) {
          toast.show(error.message || 'Error fetching data', "error", 5000);
        }
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  const toggleRow = (index: number) => {
    setEditingModerator(null);
    setNewModerator({ name: "", contactNumber: "" });
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const handleEditModerator = (rowIndex: number, modIndex: number, name: string, contactNumber: string) => {
    setExpandedRows([rowIndex]);
    setEditingModerator({ rowIndex, modIndex });
    setEditModerator({ name, contactNumber })
    setNewModerator({ name: "", contactNumber: "" });
  };

  const handleSaveEditModerator = async (moderatorId: number, authId: number) => {
    if (!editModerator.name.trim() || !editModerator.contactNumber.trim()) {
      toast?.show("Name and contact number are required.", "error", 5000);
      return;
    }
    try {
      const response = await fetch(`/api/admin/moderator/${moderatorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moderatorName: editModerator.name.trim(),
          moderatorContact: editModerator.contactNumber.trim(),
          authId: authId,
        }),
      });
      // Handle 401 Unauthorized
      if (response.status === 401) {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/login');
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add moderator");
      }
  
      const result = await response.json();
      toast?.show("Moderator updated Successfully", "success", 5000);
      // Update the UI state
      const updatedData: any = data.map((auth: any) => {
        if (auth.id === authId) {
          return {
            ...auth,
            moderators: auth.moderators.map((mod: any) =>
              mod.id === moderatorId
                ? { ...mod, name: editModerator.name.trim(), contactNumber: editModerator.contactNumber.trim() }
                : mod
            ),
          };
        }
        return auth;
      });
      setData(updatedData);
      setEditingModerator(null);
  
    } catch (error: any) {
      toast?.show(error.message || "Failed to add moderator", "error", 5000);
    }
  };

  const handleEditModeratorChange = (field: string, value: string, rowIndex: number) => {
    if (editingModerator) {
      setExpandedRows([rowIndex]);
      setNewModerator({ name: "", contactNumber: "" });
      if (editingModerator !== null) {
        setEditModerator((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleAddModerator = async (authId: number, rowIndex: number) => {
    if (!newModerator.name.trim() || !newModerator.contactNumber.trim()) {
      toast?.show("Name and contact number are required.", "error", 5000);
      return;
    }
  
    try {
      const response = await fetch(`/api/admin/moderator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moderatorName: newModerator.name.trim(),
          moderatorContact: newModerator.contactNumber.trim(),
          authId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add moderator");
      }
  
      const result = await response.json();
      toast?.show(result.message, "success", 5000);
      const updatedData:any = [...data];
      console.log("updatedDataupdatedData", updatedData)
      updatedData[rowIndex].moderators.push({ ...{ name: newModerator.name.trim(), contactNumber: newModerator.contactNumber.trim() } });
      setData(updatedData);
      setNewModerator({ name: "", contactNumber: "" });
  
    } catch (error: any) {
      toast?.show(error.message || "Failed to add moderator", "error", 5000);
    }
  };
  
  const deleteLogin = async (id: number) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/deleteMember/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete member");
      }
      const result = await response.json();
      if (toast) {
        toast.show(result.message, "success", 5000);
      }
    } catch (error: any) {
      if (toast) {
        toast.show(error.message || "Failed to delete member", "error", 5000);
      } else {
        alert(error.message || "Failed to delete member.");
      }
    } finally {
      setDeleting(false);
      setShowPopup({ id: null, descendantOf: null });
    }
  };

  const deleteModerator = async (id: number) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/deleteMember/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete member");
      }
      const result = await response.json();
      if (toast) {
        toast.show(result.message, "success", 5000);
      }
    } catch (error: any) {
      if (toast) {
        toast.show(error.message || "Failed to delete member", "error", 5000);
      } else {
        alert(error.message || "Failed to delete member.");
      }
    } finally {
      setDeleting(false);
      setShowPopup({ id: null, descendantOf: null });
    }
  }

  const handleNewModeratorChange = (field: string, value: string, rowIndex: number) => {
    setExpandedRows([rowIndex]);
    setEditingModerator(null);
    setNewModerator((prev) => ({ ...prev, [field]: value }));
  };

  const deleteRecord = (id: number, descendantOf: string) => {
    setShowPopup({ id, descendantOf });
  };

  return (
    <Container>
      {loading
        ? <p className="text-center text-text_color m-6">Loading...</p>
        : <div className="overflow-x-auto">
          <table className="min-w-full text-text_color">
            <thead>
              <tr className="text-text_color bg-gray-800/20">
                <th className="py-2 px-4">Descendant of</th>
                <th className="py-2 px-4">Member Password</th>
                <th className="py-2 px-4">Moderator Password</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, rowIndex: number) => (
                <React.Fragment key={rowIndex}>
                  <tr
                    className="cursor-pointer border-y border-border_color bg-gray-800/10"
                  >
                    <td onClick={() => toggleRow(rowIndex)} className="py-2 px-4">{row.descendantOf}</td>
                    <td onClick={() => toggleRow(rowIndex)} className="py-2 px-4">{row.memberPassword}</td>
                    <td onClick={() => toggleRow(rowIndex)} className="py-2 px-4">{row.moderatorPassword}</td>
                    <td className="py-2 px-4">
                      <Link href={`/admin/edit_login/${row.mainMemberId}`} className="pr-1">Edit</Link>
                      <button onClick={() => deleteRecord(row.mainMemberId, row.descendantOf)} className="pl-1">Delete</button>
                    </td>
                  </tr>
                  {expandedRows.includes(rowIndex) && (
                    <tr>
                      <td colSpan={4} className="border-b border-border_color">
                        <table className="w-full bg-field_color text-text_color border-b last:border-none border-border_color">
                          <thead>
                            <tr>
                              <th className="py-2 px-4">Moderator Name</th>
                              <th className="py-2 px-4">Contact Number</th>
                              <th className="py-2 px-4">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {row.moderators.map((moderator: any, modIndex: number) => (
                              <tr key={modIndex}>
                                <td className="py-2 px-4 border-t border-border_color">
                                  {editingModerator?.rowIndex === rowIndex && editingModerator?.modIndex === modIndex ? (
                                    <Input
                                      value={editModerator.name}
                                      onChange={(e) => handleEditModeratorChange("name", e.target.value, rowIndex)}
                                    />
                                  ) : (
                                    moderator.name
                                  )}
                                </td>
                                <td className="py-2 px-4 border-t border-border_color">
                                  {editingModerator?.rowIndex === rowIndex && editingModerator?.modIndex === modIndex ? (
                                    <Input
                                      value={editModerator.contactNumber}
                                      onChange={(e) => handleEditModeratorChange("contactNumber", e.target.value, rowIndex)}
                                    />
                                  ) : (
                                    moderator.contactNumber
                                  )}
                                </td>
                                <td className="py-2 px-4 border-t border-border_color">
                                  {editingModerator?.rowIndex === rowIndex && editingModerator?.modIndex === modIndex ? (
                                    <div className="flex gap-2">
                                      <button onClick={() => handleSaveEditModerator(moderator.id, row.id)}>Save</button>
                                      <button onClick={() => setEditingModerator(null)}>Close</button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        className="pr-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditModerator(rowIndex, modIndex, moderator.name, moderator.contactNumber);
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button onClick={() => deleteModerator(moderator.id)} className="pl-1">Delete</button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td className="py-2 px-4 border-t border-border_color">
                                <Input
                                  value={newModerator.name}
                                  onChange={(e) => handleNewModeratorChange("name", e.target.value, rowIndex)}
                                />
                              </td>
                              <td className="py-2 px-4 border-t border-border_color">
                                <Input
                                  value={newModerator.contactNumber}
                                  onChange={(e) => handleNewModeratorChange("contactNumber", e.target.value, rowIndex)}
                                />
                              </td>
                              <td className="py-2 px-4 border-t border-border_color">
                                <div className="flex gap-2">
                                  <button onClick={() => handleAddModerator(row.id, rowIndex)}>Add</button>
                                  <div className="text-transparent">dumm</div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      }

      {/* Popup for Delete Confirmation */}
      {showPopup.id !== null && (
        <Popup>
          <p>Are you sure you want to delete all records of {showPopup.descendantOf}?</p>
          <div className="flex justify-end mt-4 gap-4">
            <ButtonSolid
              buttonText="Delete"
              className="button-primary"
              onClick={() => deleteLogin(showPopup.id!)}
              disabled={deleting}
            />
            <ButtonOutline
              buttonText="Cancel"
              className="button-secondary"
              onClick={() => setShowPopup({ id: null, descendantOf: null })}
            />
          </div>
        </Popup>
      )}
    </Container>
  );
}