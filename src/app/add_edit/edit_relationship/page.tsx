"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { ButtonOutline } from "@/components/Button";
import MemberList from "@/components/MemberList";
import { AddRelationship, BackButton, Warning } from "@/utils/Icons";
import { useToast } from "@/components/Toast";
import { DeleteValueTypes, editRelationshipDefaultDeleteValue, editRelationshipDefaultFormValue, EditRelationshipValueTypes } from "@/types/add__edit/edit_relationship/types";
import EditRelationShipForm from "@/components/forms/EditRelationForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import SlidePanel from "@/components/SlidePanel";

export default function EditRelationshipDetails() {
  const toast = useToast();
  const [noChanges, setNoChanges] = useState<boolean>(true);
  const [formData, setFormData] = useState<EditRelationshipValueTypes>(editRelationshipDefaultFormValue);
  const [deleteDataDefault, setDeleteDataDefault] = useState<DeleteValueTypes>(editRelationshipDefaultDeleteValue);
  const [deleteData, setDeleteData] = useState<DeleteValueTypes>(editRelationshipDefaultDeleteValue);
  const [hasPartner, setHasPatner] = useState<number | undefined | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [resetValue, setResetValue] = useState<any>({});
  const [showPartnerSwitchPanel, setShowPartnerSwitchPanel] = useState<boolean>(false);
  const [removedPartnerData, setRemovedPartnerData] = useState<{ id: number, name: string } | null>(null);
  const [isPendingRemoval, setIsPendingRemoval] = useState<boolean>(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleShowList = () => {
    setShowList(true);
  };

  useEffect(() => {
    if (formData.id) {
      const fetchMembers = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/editRelationship/${formData.id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
            }
          );
          // Handle 401 Unauthorized
          if (response.status === 401) {
            logout();
            return;
          }
          if (!response.ok) throw new Error('Failed to fetch member details');
          const { data } = await response.json();

          // Ensure children are sorted by order
          if (data.children && Array.isArray(data.children)) {
            data.children.sort((a: any, b: any) => a.order - b.order);
          }

          // If we switched to the partner who is pending removal, simulate their partner (us) being removed/hidden
          if (isPendingRemoval && removedPartnerData && data.id === removedPartnerData.id) {
            setDeleteDataDefault({
              partnerId: data.partner?.id,
              childrenId: [],
            });
            setDeleteData((prev: any) => ({
              ...prev,
              partnerId: data.partner?.id,
            }));
            data.partner = null;
          } else {
            setDeleteDataDefault(editRelationshipDefaultDeleteValue);
          }

          // Deep copy the data to prevent mutations from affecting reset state
          setResetValue({ 'data': JSON.parse(JSON.stringify(data)), 'hasPartner': data.partner?.id })

          setFormData(data);
          setHasPatner(data.partner?.id);
          setNoChanges(true);
          setSubmitError("");
        } catch (error: any) {
          toast?.show(error.message || "Error fetching member details", "error", 5000);
          router.push('/add_edit');
        } finally {
          setLoading(false);
        }
      };

      fetchMembers();
    }
  }, [formData.id, toast, router, logout]);

  const handleRemoveChildrenValue = (id: number) => {
    setNoChanges(false);
    setSubmitError("");
    setFormData((prev: any) => {
      if (Array.isArray(prev['children'])) {
        // Find the child to remove
        const childToRemove = prev.children.find((entry: any) => entry.id === id);
        if (!childToRemove) return prev;

        setDeleteData((prevDeleted: any) => ({
          ...prevDeleted,
          ['childrenId']: [...prevDeleted['childrenId'], id],
        }));
        // Remove the existing entry
        return {
          ...prev,
          ['children']: prev['children'].filter((entry: any) => entry.id !== id),
        };
      }
    });
  };

  const handleDivorcePartner = () => {
    setDeleteData((prev: any) => ({
      ...prev,
      partnerId: formData.partner?.id,
    }));
    setNoChanges(false);
    setSubmitError("");
    setFormData((prev: any) => ({
      ...prev,
      partner: null,
    }));
  };

  const handleClose = () => {
    if (!noChanges) {
      setFormData(resetValue.data);
      setHasPatner(resetValue.hasPartner);
      setDeleteData(deleteDataDefault)
      setNoChanges(true);
      setSubmitError("");
      return
    }
    router.push("/add_edit?mode=edit");
  }

  const handleSelectedValue = (name: string, id: number) => {
    setFormData((prev) => ({ ...prev, name, id }));
    setShowList(false);
    setSubmitError("");
  };

  const handleSkip = () => {
    setShowList(false);
    setShowPartnerSwitchPanel(false);
    setRemovedPartnerData(null);
    setIsPendingRemoval(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noChanges) {
      toast?.show("No changes to update", "error", 5000);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");
      const response = await fetch(`/api/editRelationship/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          deleteData: deleteData,
          hasPartner: hasPartner,
          childrenOrder: formData.children?.map(({ id, order }) => ({ id, order }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || "Failed to update member";
        toast?.show(errorMsg, "error", 5000);
        setSubmitError(errorMsg);
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (result) {
        toast?.show(result.message, "success", 5000);

        // Handle Partner Removal Flow
        if (result.partnerRemoved && !removedPartnerData) {
          setRemovedPartnerData(result.removedPartnerData);
          setIsPendingRemoval(!!result.isPendingVerification);
          setShowPartnerSwitchPanel(true);
          setShowList(true);
        }

        if (result.partnerRemoved && removedPartnerData) {
          handleSkip();
        }

        setFormData(editRelationshipDefaultFormValue);
        setDeleteData(editRelationshipDefaultDeleteValue);
        setNoChanges(true);
        setSubmitError("");
      }
    } catch (error: any) {
      console.error("Error updating member:", error);
      const errorMsg = error.message || "Failed to update member";
      toast?.show(errorMsg, "error", 5000);
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:flex text-text_color">
      <Container className='relative'>
        {(loading || submitting) && <div className={`absolute inset-0 flex justify-center items-start bg-gray-50/30 z-20 cursor-wait`}>
          <p className="mt-20 px-2 bg-field_color border border-border_color text-text_color rounded-md z-[100]">{loading ? 'Loading...' : 'Submitting...'}</p>
        </div>}
        <div className="w-full md:max-w-xl px-4 py-5 md:py-10 mx-auto">
          <div className="flex items-center mb-3">
            <span className="hidden md:block"><AddRelationship /></span>
            <Link href={"/add_edit?mode=edit"} className="md:hidden block">
              <span><BackButton /></span>
            </Link>
            <p className="text-2xl font-semibold text-center text-text_color underline pl-3">
              Edit Relationship
            </p>
          </div>
          {(formData.pendingVerification > 0) && <p className="w-full py-1 px-2 my-6 border border-border_color border-dashed rounded-md bg-field_color"><span className='inline-block align-bottom pr-2'><Warning /></span>{formData.pendingVerification} pending verification</p>}
          <EditRelationShipForm
            allowSwitch={removedPartnerData === null}
            handleShowList={handleShowList}
            handleDivorcePartner={handleDivorcePartner}
            handleRemoveChildrenValue={handleRemoveChildrenValue}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            setNoChanges={setNoChanges}
            submitting={submitting}
            submitError={submitError}
          />
          <ButtonOutline buttonText={noChanges ? "Cancel" : "Reset Changes"} onClick={handleClose} className="hidden md:block w-full" />
        </div>
      </Container>
      <SlidePanel setShowDetails={(val) => { setShowList(val); if (!val) setShowPartnerSwitchPanel(false) }} showDetails={showList} >
        {showPartnerSwitchPanel && removedPartnerData ? (
          <div className="p-4">
            <h3 className="tex-lg font-semibold mb-4 text-text_color">Partner Removed</h3>
            <p className="text-sm text-text_color mb-6">
              {isPendingRemoval
                ? <>Your request to remove <strong>{removedPartnerData.name}</strong> as partner is pending verification, since change involves verified member. Do you want to switch to {removedPartnerData.name} profile to edit their children/details?</>
                : <>You have removed <strong>{removedPartnerData.name}</strong> as partner. Do you want to switch to {removedPartnerData.name} profile to edit their children/details?</>
              }
            </p>
            <div className="flex gap-4">
              <ButtonOutline
                buttonText="Skip"
                onClick={() => { handleSkip(); }}
                className="w-full"
              />
              <ButtonOutline
                buttonText="Continue"
                onClick={() => {
                  handleSelectedValue(removedPartnerData.name, removedPartnerData.id);
                  setShowPartnerSwitchPanel(false);
                }}
                className="w-full bg-field_hover"
              />
            </div>
          </div>
        ) : (
          <MemberList
            forType={'editRelationship'}
            getSelectedValues={formData}
            setSelectedValue={handleSelectedValue}
            openList={setShowList}
            multiselect={false}
            descendant={null}
          />
        )}
      </SlidePanel>
    </div>
  );
}