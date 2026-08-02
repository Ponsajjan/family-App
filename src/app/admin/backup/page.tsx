'use client'

import { useState } from 'react'
import { useToast } from '@/components/Toast';
import Topnav from "@/components/Topnav";
import { appFetch } from "@/utils/appFetch";
import { FileUploadIcon, ResetData } from "@/utils/Icons";
import { ButtonOutline } from '@/components/Button';

export default function DBBackupRestore() {
  const toast = useToast();
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);
  const [isRestoreLoading, setIsRestoreLoading] = useState<boolean>(false);

  const handleDownloadGlobalBackup = async () => {
    try {
      setIsDownloadLoading(true);
      const response = await appFetch(`/api/admin/backup`);
      if (!response.ok) throw new Error("Failed to generate global backup");

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `GLOBAL_DATABASE_BACKUP_${date}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast?.show("Global backup downloaded successfully", "success", 5000);
    } catch (error: any) {
      toast?.show(error.message || "Failed to download global backup", "error", 5000);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleRestoreGlobalBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);

        if (backupData.type !== "full") {
          throw new Error("This is not a full database backup file.");
        }

        if (!confirm("⚠️ CAUTION: You are about to restore the ENTIRE DATABASE. This will delete all current families, members, and credentials and replace them with the backup. This cannot be undone. Are you absolutely sure?")) {
          return;
        }

        setIsRestoreLoading(true);
        const response = await appFetch(`/api/admin/backup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backupData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Global restore failed");
        }

        toast?.show("Database restored successfully", "success", 5000);
        // Force a hard reload to clear all states
        window.location.href = '/admin';
      } catch (error: any) {
        toast?.show(error.message || "Invalid backup file", "error", 5000);
      } finally {
        setIsRestoreLoading(false);
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full h-full min-h-screen bg-main_background">
      <Topnav>
        <h1 className="text-lg font-semibold ml-2">Database Backup & Restore</h1>
      </Topnav>

      <div className="w-full p-6 md:p-10 max-w-5xl mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Backup Card */}
          <div className="bg-field_color border border-border_color rounded-2xl p-8 flex flex-col items-center justify-between text-center shadow-lg md:hover:shadow-xl transition-shadow duration-300">
            <div className="w-20 h-20 bg-accent_color/10 rounded-full flex items-center justify-center mb-6 text-accent_color">
              <FileUploadIcon />
            </div>
            <h2 className="text-2xl font-bold text-text_color mb-3">Full DB Backup</h2>
            <p className="text-text_color/70 mb-8 max-w-sm min-h-12">
              Download a complete snapshot of all families, members, and credentials in JSON format.
            </p>
            <ButtonOutline
              onClick={handleDownloadGlobalBackup}
              disabled={isDownloadLoading || isRestoreLoading}
              type='button'
              className='w-full'
              buttonText={isDownloadLoading ? 'Processing...' : 'Download Backup'}
            />
          </div>

          {/* Restore Card */}
          <div className="bg-field_color border border-border_color rounded-2xl p-8 flex flex-col items-center justify-between text-center shadow-lg md:hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
            {/* Caution tape pattern top border */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[repeating-linear-gradient(45deg,#ffcc00,#ffcc00_10px,#000_10px,#000_20px)]"></div>

            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
              <ResetData />
            </div>
            <h2 className="text-2xl font-bold text-text_color mb-3">Full DB Restore</h2>
            <p className="text-red-500/80 font-medium mb-8 max-w-sm min-h-12">
              ⚠️ Warning: Restoring a backup will completely overwrite all existing data. This action cannot be undone.
            </p>

            <label className={`flex justify-center items-center bg-accent_color text-accent_contrast h-10 md:h-12 text-base md:text-lg shadow-md rounded-md font-medium active:shadow-none w-full
              ${isRestoreLoading
                ? 'opacity-60 cursor-not-allowed'
                : 'cursor-pointer'}`}>
              {isRestoreLoading ? 'Processing...' : 'Upload & Restore'}
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleRestoreGlobalBackup}
                disabled={isRestoreLoading || isDownloadLoading}
              />
            </label>
          </div>
        </div>

        {(isDownloadLoading || isRestoreLoading) && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]">
            <div className="bg-main_background border border-border_color px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
              <div className="w-4 h-4 border-2 border-accent_color border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-text_color">Processing Global Data...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
