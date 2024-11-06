'use client';

import { Female, Male, SearchIcon } from '@/utils/Icons';
import React, { useEffect, useState } from 'react';
import Container from "@/components/Container";
import Checkbox from '@/components/CheckBox';
import Input from '@/components/Input';
import { ButtonSolid } from './Button';

interface User {
  id: string;
  name: string;
  gender: 'male' | 'female';
  parentNames?: string;
}

export default function MemberList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const usersData: User[] = await response.json();
        const sortedUsers = usersData.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, []);

  const groupedUsers = users.reduce<{ [key: string]: User[] }>((acc, user) => {
    const initial = user.name.charAt(0).toUpperCase();
    if (!acc[initial]) acc[initial] = [];
    acc[initial].push(user);
    return acc;
  }, {});

  return (
    <div className="w-full md:flex">
      <Container className="md:border-r md:border-border_color">
        <div className='px-3 pb-3 border-b border-border_color sticky top-3 bg-main_background z-10'>
          <div className="relative w-full">
            <Input placeholder="Search.." className="pl-9" />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <SearchIcon />
            </span>
          </div>
        </div>
        
        <div className='pb-4'>
          {Object.keys(groupedUsers).sort().map((initial) => (
            <div key={initial}>
              <div className="flex text-text_color items-center px-3 bg-main_background sticky top-12 md:top-[67px] z-[9]">
                <span className="font-semibold pr-1 whitespace-nowrap">{initial}</span>
                <span className="border-t border-border_color block w-full"></span>
              </div>

              {groupedUsers[initial].map((user) => (
                <div key={user.id} className="pl-4">
                  <div className="border-l border-border_color py-1 pl-4 pr-3">
                    <div className="cursor-pointer px-3 py-2 flex items-center border border-border_color bg-field_color rounded text-text_color">
                      <div className='pr-3 border-r border-border_color'>
                        <Checkbox name="selected" />
                      </div>
                      <div className='pl-4'>
                        <div className="flex flex-wrap gap-2">
                          {user.gender === "male" ? <Male /> : <Female />}
                          <div className='font-semibold capitalize'>{user.name}</div>
                        </div>
                        <div className='flex text-xs leading-3 opacity-65'>
                          <div className='font-medium pr-1'>Parents:</div>
                          <div>{user.parentNames || "No parent information"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <ButtonSolid buttonText='Submit' className='w-full sticky bottom-0 z-10 rounded-none'/>
      </Container>
    </div>
  );
}
