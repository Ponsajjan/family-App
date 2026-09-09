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
import PopupModal from "@/components/PopupModal";
import { useToast } from "@/components/Toast";
import { Male, Female, SwitchIcon, SwitchMainAccount, Warning } from "@/utils/Icons";

const RELATIONSHIP_LIMITATIONS: string[] = [
  "Elder/younger terms (பெரியப்பா vs சித்தப்பா, அண்ணன் vs தம்பி, etc.) need a known birth date on both people. Without one, the result falls back to a combined or gender-neutral term.",
  "First cousins are labelled as cross (மச்சான்/மைத்துனி) or parallel (sibling-style) based on the genders of the two linking parents. If either linking parent isn't recorded, it defaults to the sibling-style term.",
  "Relations more than 2-3 generations removed from a direct ancestor/descendant (e.g. a great-grand-uncle, or a cousin twice removed) are shown with a general term such as 'உறவினர்' or 'தொலைதூர உறவினர்' rather than an exact title.",
  "In-law terms are only precise for a spouse's parent, child, sibling, uncle/aunt, or grandparent. Anything further out (e.g. a spouse's cousin) is shown as the blood relative's own term plus a husband/wife word.",
  "Every result depends on father, mother, and partner links being entered correctly. A missing or incorrect link can produce a wrong relationship, or 'No direct relationship found'.",
  "When two people are related through more than one common ancestor (e.g. double cousins), only the closest single path is used to determine the relationship shown.",
];

function RelationshipLimitationsNotice() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        aria-label="Known limitations in finding relationships"
        title="Known limitations in finding relationships"
        className="fixed bottom-4 right-4 z-30 flex items-center justify-center p-2.5 rounded-lg border border-border_color bg-field_color text-yellow-600 shadow-lg cursor-pointer hover:bg-field_hover transition-colors"
      >
        <Warning />
      </button>
      {showPopup && (
        <PopupModal title="Known Limitations" onClose={() => setShowPopup(false)}>
          <div className="overflow-y-auto">
            <p className="text-sm opacity-75 mb-3">
              Relationship terms are computed automatically from the family tree data. Some kinds of relationships can come out approximate or incorrect for the reasons below:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {RELATIONSHIP_LIMITATIONS.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </PopupModal>
      )}
    </>
  );
}

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
        <p className="text-xs mb-1">{label}</p>
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
  const [listOpenCount, setListOpenCount] = useState(0);
  const [showChoosePopup, setShowChoosePopup] = useState(false);

  const { chooseAccountPopup, currentAuthId, mainMemberName } = useSelector((state: RootState) => state.terms);

  const url = selectedA && selectedB
    ? `/api/relationship?personAId=${selectedA.id}&personBId=${selectedB.id}`
    : null;
  const { data, error, isLoading } = useSWR<RelationshipResponse>(token && url ? url : null);

  const openList = (which: 'A' | 'B') => {
    setShowListFor(which);
    setShowList(true);
    setListOpenCount((count) => count + 1);
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
      <Topnav />
      <div className="w-full md:flex">
        <Container>
          <div className="w-full md:max-w-3xl px-4 py-10 mx-auto">
            <div className="relative flex items-center gap-2 h-10 mb-2">
              {chooseAccountPopup.length > 1 &&
                <>
                  <div className="text-text_color/60 z-10 bg-main_background md:text-sm text-xs whitespace-nowrap px-1.5 mx-4 max-w-80 text-ellipsis overflow-clip">{mainMemberName} Family</div>
                  <div className="ml-auto mr-0 z-10 bg-main_background px-1.5">
                    <button
                      type="button"
                      onClick={() => setShowChoosePopup(true)}
                      aria-label="Switch family account"
                      className="border border-border_color flex items-center justify-between rounded-full p-1 cursor-pointer md:hover:bg-field_hover transition-colors bg-transparent text-inherit focus:outline-none"
                    >
                      <SwitchMainAccount aria-hidden="true" />
                    </button>
                  </div>
                  <span className="absolute text-text_color/60 w-full border-b border-border_color border-dashed" />
                </>}
            </div>
            <div className="flex flex-col md:flex-row items-center md:gap-2">
              <div className="w-full flex-1">
                <PersonPickerCard label="Person 1" person={selectedA} active={showList && showListFor === 'A'} onClick={() => openList('A')} />
              </div>
              <button
                type="button"
                onClick={handleSwap}
                disabled={!selectedA && !selectedB}
                aria-label="Swap selected people"
                className="relative z-10 -my-4 md:my-0 p-2 border border-border_color rounded-full bg-field_color disabled:opacity-40 cursor-pointer rotate-90 md:rotate-0 md:hover:border-text_color transition-colors"
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
            focusSearchKey={listOpenCount}
          />
        </SlidePanel>
      </div>
      {showChoosePopup && (
        <ChoosePopup
          setShowPopup={setShowChoosePopup}
          onSwitchSuccess={handleSwitchSuccess}
        />
      )}
      <RelationshipLimitationsNotice />
    </div>
  );
}
