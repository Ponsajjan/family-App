'use client'

import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { getCookie } from 'cookies-next';
import { SwitchIcon } from "@/utils/Icons";
import { useEffect, useState } from "react";
import { ChoosePopup, type AccountDetail } from "@/components/ChoosePopup";
import { useAuth } from "@/contexts/AuthContext";


export default function FamilyTreePage() {
  const [showChoosePopup, setShowChoosePopup] = useState(false);
  const [switchAccounts, setSwitchAccounts] = useState<AccountDetail[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const token = getCookie('token');

  useEffect(() => {
    async function fetchTree() {
      try {
        setLoading(true);
        const res = await fetch('/api/tree/get_chart');

        if (res.status === 401) {
          logout();
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch family tree");
        }

        const result = await res.json();
        setData(result.treeData);
        setSwitchAccounts(result.switchAccounts || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchTree();
    }
  }, [logout, fetchTrigger, token]);

  if (!token) {
    return (
      <div className="w-full">
        <Topnav />
        <div className="text-center text-text_color m-6">Unauthorized. Please login.</div>
      </div>);
  }

  return (
    <div className="w-full">
      <Topnav>
        {switchAccounts.length > 1 && <div
          onClick={() => setShowChoosePopup(true)}
          className="ml-auto mr-0 border border-border_color flex items-center justify-between rounded-md px-1 py-1 cursor-pointer"
        >
          <SwitchIcon />
        </div>}
      </Topnav>

      {loading ? (
        <div className="text-center text-text_color p-10">Loading family tree...</div>
      ) : error ? (
        <div className="text-center text-text_color p-10">{error}</div>
      ) : (
        <DragScroll>
          <FetchFamilyTree data={data} />
        </DragScroll>
      )}

      {showChoosePopup && (
        <ChoosePopup
          showPopup={showChoosePopup}
          setShowPopup={setShowChoosePopup}
          data={switchAccounts}
          onSwitchSuccess={() => setFetchTrigger(prev => prev + 1)}
        />
      )}
    </div>
  );
}
