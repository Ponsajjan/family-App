'use client'

import Container from "@/components/Container";
import Input from "@/components/Input";
import Topnav from "@/components/Topnav";
import { Logout } from "@/utils/Icons";
import React, { useState } from "react";


const logout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'GET' });
  
      if (response.ok) {
        window.location.href = '/login';
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

const data = [
  {
    descendantOf: "John Doe",
    memberPassword: "********",
    moderatorPassword: "********",
    moderators: [
      { name: "Alice", contactNumber: "123-456-7890" },
      { name: "Bob", contactNumber: "987-654-3210" },
    ],
  },
  {
    descendantOf: "Jane Smith",
    memberPassword: "********",
    moderatorPassword: "********",
    moderators: [
      { name: "Charlie", contactNumber: "555-555-5555" },
      { name: "Diana", contactNumber: "444-444-4444" },
    ],
  },
  {
    descendantOf: "Jaden Smith",
    memberPassword: "********",
    moderatorPassword: "********",
    moderators: [],
  },
];

export default function ExpandableTable() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  return (
    <div className="w-full">
      <Topnav>
        <button onClick={logout} className="px-2 ml-auto mr-0 flex items-center gap-2"><Logout /></button>
      </Topnav>
      <Container>
          <div className="overflow-x-auto">
            <table className="min-w-full border-b text-text_color border-border_color">
              <thead>
                <tr className="bg-main_background/40 text-text_color">
                  <th className="py-2 px-4 border-b border-border_color">Descendant of</th>
                  <th className="py-2 px-4 border-b border-border_color">Member Password</th>
                  <th className="py-2 px-4 border-b border-border_color">Moderator Password</th>
                  <th className="py-2 px-4 border-b border-border_color">Action</th>
                </tr>
              </thead>
              <tbody>
              {data.map((row, index) => (
                <React.Fragment key={index}>
                  <tr
                    onClick={() => toggleRow(index)}
                    className="cursor-pointer hover:bg-field_hover bg-field_color/60"
                  >
                    <td className="py-2 px-4 border-b border-border_color">{row.descendantOf}</td>
                    <td className="py-2 px-4 border-b border-border_color">{row.memberPassword}</td>
                    <td className="py-2 px-4 border-b border-border_color">{row.moderatorPassword}</td>
                    <td className="py-2 px-4 border-b border-border_color">
                      <span className="pr-1">Edit</span>
                      <span className="pl-1">Delete</span>
                    </td>
                  </tr>
                  {expandedRows.includes(index) && (
                    <tr>
                      <td colSpan={4}>
                          <table className="w-full bg-field_color text-text_color border-b border-border_color">
                              <thead>
                                  <tr>
                                      <th className="py-2 px-4">Moderator Name</th>
                                      <th className="py-2 px-4">Contact Number</th>
                                      <th className="py-2 px-4 w-36">Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {row.moderators.map((moderator, modIndex) => (
                                  <tr key={modIndex}>
                                    <td className="py-2 px-4 border-t border-border_color">
                                      {moderator.name}
                                    </td>
                                    <td className="py-2 px-4 border-t border-border_color">
                                      {moderator.contactNumber}
                                    </td>
                                    <td className="py-2 px-4 border-t border-border_color w-36">
                                      <span className="pr-1">Edit</span>
                                      <span className="pl-1">Delete</span>
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
                                      <button>Add</button>
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
    </div>
  );
};