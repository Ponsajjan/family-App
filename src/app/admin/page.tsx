'use client'

import Container from "@/components/Container";
import Input from "@/components/Input";
import Link from "next/link";
import React, { useState } from "react";

const data = [
  {
    id: 30,
    descendantOf: "John Doe",
    memberPassword: "JohnDoe",
    moderatorPassword: "JohnDoe123",
    moderators: [
      { name: "Alice", contactNumber: "123-456-7890" },
      { name: "Bob", contactNumber: "987-654-3210" },
    ],
  },
  {
    id: 31,
    descendantOf: "Jane Smith",
    memberPassword: "JaneSmith",
    moderatorPassword: "JaneSmith123",
    moderators: [
      { name: "Charlie", contactNumber: "555-555-5555" },
      { name: "Diana", contactNumber: "444-444-4444" },
    ],
  },
  {
    id: 32,
    descendantOf: "Jaden Smith",
    memberPassword: "JadenSmith",
    moderatorPassword: "JadenSmith123",
    moderators: [],
  },
];

export default function ExpandableTable() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [editingModerator, setEditingModerator] = useState<{ rowIndex: number; modIndex: number } | null>(null);
  const [editedData, setEditedData] = useState(data);
  const [newModerator, setNewModerator] = useState({ name: "", contactNumber: "" });

  const toggleRow = (index: number) => {
    setEditingModerator(null);
    setEditedData(data);
    setNewModerator({ name: "", contactNumber: "" });
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const handleEditModerator = (rowIndex: number, modIndex: number) => {
    setExpandedRows([rowIndex]);
    setEditingModerator({ rowIndex, modIndex });
    setNewModerator({ name: "", contactNumber: "" });
  };

  const handleSaveModerator = () => {
    setEditingModerator(null);
    // You can add logic here to save the edited data to your backend or state
  };

  const handleChangeModerator = (field: string, value: string) => {
    if (editingModerator) {
      const { rowIndex, modIndex } = editingModerator;
      const updatedData = [...editedData];
      updatedData[rowIndex].moderators[modIndex] = {
        ...updatedData[rowIndex].moderators[modIndex],
        [field]: value,
      };
      setEditedData(updatedData);
    }
  };

  const handleAddModerator = (rowIndex: number) => {
    if (newModerator.name && newModerator.contactNumber) {
      const updatedData = [...editedData];
      updatedData[rowIndex].moderators.push({ ...newModerator });
      setEditedData(updatedData);
      setNewModerator({ name: "", contactNumber: "" }); // Reset the form
    }
  };

  const handleNewModeratorChange = (field: string, value: string, rowIndex: number) => {
    setExpandedRows([rowIndex]);
    setEditingModerator(null);
    setNewModerator((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <div className="overflow-x-auto">
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
            {editedData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr
                  className="cursor-pointer border-y border-border_color bg-gray-800/10"
                >
                  <td onClick={() => toggleRow(rowIndex)} className="py-2 px-4">{row.descendantOf}</td>
                  <td onClick={() => toggleRow(rowIndex)} className="py-2 px-4">{row.memberPassword}</td>
                  <td onClick={() => toggleRow(rowIndex)} className="py-2 px-4">{row.moderatorPassword}</td>
                  <td className="py-2 px-4">
                    <Link onClick={(e) => e.preventDefault } href={`/admin/edit_login/${row.id}`} className="pr-1">Edit</Link>
                    <button className="pl-1">Delete</button>
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
                          {row.moderators.map((moderator, modIndex) => (
                            <tr key={modIndex}>
                              <td className="py-2 px-4 border-t border-border_color">
                                {editingModerator?.rowIndex === rowIndex && editingModerator?.modIndex === modIndex ? (
                                  <Input
                                    value={moderator.name}
                                    onChange={(e) => handleChangeModerator("name", e.target.value)}
                                  />
                                ) : (
                                  moderator.name
                                )}
                              </td>
                              <td className="py-2 px-4 border-t border-border_color">
                                {editingModerator?.rowIndex === rowIndex && editingModerator?.modIndex === modIndex ? (
                                  <Input
                                    value={moderator.contactNumber}
                                    onChange={(e) => handleChangeModerator("contactNumber", e.target.value)}
                                  />
                                ) : (
                                  moderator.contactNumber
                                )}
                              </td>
                              <td className="py-2 px-4 border-t border-border_color">
                                {editingModerator?.rowIndex === rowIndex && editingModerator?.modIndex === modIndex ? (
                                  <div className="flex gap-2">
                                    <button onClick={handleSaveModerator}>Save</button>
                                    <button onClick={() => setEditingModerator(null)}>Close</button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      className="pr-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditModerator(rowIndex, modIndex);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button className="pl-1">Delete</button>
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
                                <button onClick={() => handleAddModerator(rowIndex)}>Add</button>
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
    </Container>
  );
}