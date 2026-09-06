'use client';

import { useState } from "react";
import { getCookie } from "cookies-next";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Topnav from "@/components/Topnav";
import Container from "@/components/Container";
import MemberList from "@/components/MemberList";
import SlidePanel from "@/components/SlidePanel";
import { ChoosePopup } from "@/components/ChoosePopup";
import { useToast } from "@/components/Toast";
import { Male, Female, SwitchIcon, SwitchMainAccount } from "@/utils/Icons";

interface SelectedPerson {
  id: number;
  name: string;
  gender: 'Male' | 'Female';
}

interface RelationshipResult {
  label: string;
  description?: string;
}

interface RelationshipResponse {
  personA: SelectedPerson;
  personB: SelectedPerson;
  relationOfBToA: RelationshipResult;
  relationOfAToB: RelationshipResult;
}

function GenderIcon({ gender }: { gender: string }) {
  if (gender === 'Male') return <Male />;
  if (gender === 'Female') return <Female />;
  return null;
}

function PersonPickerCard({
  label,
  person,
  active,
  onClick,
}: {
  label: string;
  person: SelectedPerson | null;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left outline rounded-md px-4 py-3 flex items-center gap-3 hover:outline-2 hover:outline-accent_color cursor-pointer ${active ? 'outline-2 outline-accent_color' : 'outline-1 outline-border_color'}`}
    >
      <div className="flex-1">
        <p className="text-xs opacity-65 mb-1">{label}</p>
        {person ? (
          <div className="flex items-center gap-2 font-medium">
            <GenderIcon gender={person.gender} />
            <span>{person.name}</span>
          </div>
        ) : (
          <p className="opacity-65">Select a person</p>
        )}
      </div>
    </button>
  );
}

export default function RelationshipPage() {
  const token = getCookie('token');
  const toast = useToast();

  const [selectedA, setSelectedA] = useState<SelectedPerson | null>(null);
  const [selectedB, setSelectedB] = useState<SelectedPerson | null>(null);
  const [showList, setShowList] = useState(false);
  const [showListFor, setShowListFor] = useState<'A' | 'B'>('A');
  const [showChoosePopup, setShowChoosePopup] = useState(false);

  const { chooseAccountPopup, currentAuthId } = useSelector((state: RootState) => state.terms);

  const url = selectedA && selectedB
    ? `/api/relationship?personAId=${selectedA.id}&personBId=${selectedB.id}`
    : null;
  const { data, error, isLoading } = useSWR<RelationshipResponse>(token && url ? url : null);

  const openList = (which: 'A' | 'B') => {
    setShowListFor(which);
    setShowList(true);
  };

  const handleSelectedValue = (name: string, id: number, _select: string, _verified: boolean, gender?: 'Male' | 'Female') => {
    const other = showListFor === 'A' ? selectedB : selectedA;
    if (other && other.id === id) {
      toast?.show('This person is already selected', 'error', 4000);
      return;
    }

    const person: SelectedPerson = { id, name, gender: gender ?? 'Male' };
    if (showListFor === 'A') {
      setSelectedA(person);
    } else {
      setSelectedB(person);
    }
    setShowList(false);
  };

  const handleSwap = () => {
    setSelectedA(selectedB);
    setSelectedB(selectedA);
  };

  const handleSwitchSuccess = () => {
    setSelectedA(null);
    setSelectedB(null);
    setShowList(false);
  };

  if (!token) {
    return (
      <div className="w-full">
        <Topnav />
        <div className="text-center text-text_color m-6">Unauthorized. Please login.</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Topnav>
        {chooseAccountPopup.length > 1 && (
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowChoosePopup(true)}
              aria-label="Switch family account"
              className="border border-border_color flex items-center justify-between rounded-md px-1 py-1 cursor-pointer bg-transparent text-inherit focus:outline-none"
            >
              <SwitchMainAccount />
            </button>
          </div>
        )}
      </Topnav>
      <div className="w-full md:flex">
        <Container>
          <div className="w-full md:max-w-3xl px-4 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:gap-2">
              <div className="w-full flex-1">
                <PersonPickerCard label="Person 1" person={selectedA} active={showList && showListFor === 'A'} onClick={() => openList('A')} />
              </div>
              <button
                type="button"
                onClick={handleSwap}
                disabled={!selectedA && !selectedB}
                aria-label="Swap selected people"
                className="relative z-10 -my-4 sm:my-0 p-2 border border-border_color rounded-full bg-field_color disabled:opacity-40 cursor-pointer rotate-90 sm:rotate-0"
              >
                <SwitchIcon />
              </button>
              <div className="w-full flex-1">
                <PersonPickerCard label="Person 2" person={selectedB} active={showList && showListFor === 'B'} onClick={() => openList('B')} />
              </div>
            </div>

            <div className="mt-6">
              {!selectedA || !selectedB ? (
                <p className="text-center py-6">Select two people to find their relationship</p>
              ) : isLoading ? (
                <p className="text-center py-6 loading-text">Analyzing...</p>
              ) : error ? (
                <p className="text-center py-6">{error.message || 'Something went wrong'}</p>
              ) : data ? (
                <div className="bg-field_color rounded-md p-4 mt-4">
                  <p className="text-lg">
                    <span className="font-semibold">{data.personA.name}</span>-இன்{' '}
                    <span className="font-semibold text-accent_color">{data.relationOfBToA.label}</span>{' '}
                    <span className="font-semibold">{data.personB.name}</span> ஆவார்.
                  </p>
                  {data.relationOfBToA.description && (
                    <p className="text-sm opacity-65 mt-1">{data.relationOfBToA.description}</p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Container>
        <SlidePanel setShowDetails={setShowList} showDetails={showList}>
          <MemberList
            key={currentAuthId}
            forType="selectMember"
            gender={null}
            excludeId={null}
            getSelectedValues={{}}
            setSelectedValue={handleSelectedValue}
            openList={setShowList}
            multiselect={false}
            descendant={null}
          />
        </SlidePanel>
      </div>
      {showChoosePopup && (
        <ChoosePopup
          setShowPopup={setShowChoosePopup}
          onSwitchSuccess={handleSwitchSuccess}
        />
      )}
    </div>
  );
}
