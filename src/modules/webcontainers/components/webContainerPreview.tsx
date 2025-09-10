"use client"

import { TemplateFolder } from "@/modules/playground/lib/pathToJson-util";
import { WebContainer } from "@webcontainer/api";

interface WebContainerPreviewProps {
    templateData: TemplateFolder;
    serverUrl: string;
    isLoading: boolean;
    error: string | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    forceResetup?: boolean; // Optional prop to force re-setup
}


const WebContainerPreview = ({
    templateData,
    error,
    instance,
    isLoading,
    serverUrl,
    writeFileSync,
    forceResetup = false,
}: WebContainerPreviewProps) => {
    return (
        <div>
            
        </div>
    )
}

export default WebContainerPreview
