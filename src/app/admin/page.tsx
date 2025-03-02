'use client'

import Container from "@/components/Container";
import Input from "@/components/Input";
import React, { useState } from "react";

const data = [
  {
    descendantOf: "John Doe",
    memberPassword: "JohnDoe",
    moderatorPassword: "JohnDoe123",
    moderators: [
      { name: "Alice", contactNumber: "123-456-7890" },
      { name: "Bob", contactNumber: "987-654-3210" },
    ],
  },
  {
    descendantOf: "Jane Smith",
    memberPassword: "JaneSmith",
    moderatorPassword: "JaneSmith123",
    moderators: [
      { name: "Charlie", contactNumber: "555-555-5555" },
      { name: "Diana", contactNumber: "444-444-4444" },
    ],
  },
  {
    descendantOf: "Jaden Smith",
    memberPassword: "JadenSmith",
    moderatorPassword: "JadenSmith123",
    moderators: [],
  },
];

export default function ExpandableTable() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [editingModerator, setEditingModerator] = useState<{ rowIndex: number; modIndex: number } | null>(null); // Track which moderator is being edited
  const [editedData, setEditedData] = useState(data); // Store edited data

  const toggleRow = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const handleEditModerator = (rowIndex: number, modIndex: number) => {
    setEditingModerator({ rowIndex, modIndex }); // Set the moderator to edit mode
  };

  const handleSaveModerator = () => {
    setEditingModerator(null); // Exit edit mode
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
      setEditedData(updatedData); // Update the edited data in state
    }
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
                  onClick={() => toggleRow(rowIndex)}
                  className="cursor-pointer border-y border-border_color bg-gray-800/10"
                >
                  <td className="py-2 px-4">{row.descendantOf}</td>
                  <td className="py-2 px-4">{row.memberPassword}</td>
                  <td className="py-2 px-4">{row.moderatorPassword}</td>
                  <td className="py-2 px-4">
                    <span className="pr-1">Edit</span>
                    <span className="pl-1">Delete</span>
                  </td>
                </tr>
                {expandedRows.includes(rowIndex) && (
                  <tr>
                    <td colSpan={4} className="border-r border-b border-border_color">
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
                                    <button>Close</button>
                                  </div>
                                ) : (
                                  <>
                                    <span
                                      className="pr-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditModerator(rowIndex, modIndex);
                                      }}
                                    >
                                      Edit
                                    </span>
                                    <span className="pl-1">Delete</span>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td className="py-2 px-4 border-t border-border_color">
                              <Input name="name" />
                            </td>
                            <td className="py-2 px-4 border-t border-border_color">
                              <Input name="contactNumber" />
                            </td>
                            <td className="py-2 px-4 border-t border-border_color">
                              <div className="flex gap-2">
                                <button>Add</button>
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