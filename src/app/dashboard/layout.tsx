import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import DashboardSidebar from "@/modules/dashboard/components/dashboardSidebar";

// Always try to keep layout as a Server Component

export default async function DashBoardLayout({ children }: {
    children: React.ReactNode
}) {

    // Loading all the playground of the current logind user
    const playgroundData = await getAllPlaygroundForUser()

    // Record: It’s compile-time only (TypeScript feature, doesn’t exist at runtime).
    const techIconMap: Record<string, string> = {
        REACT: "Zap",
        NEXTJS: "Lightbulb",
        EXPRESS: "Database",
        VUE: "Compass",
        HONO: "FlameIcon",
        ANGULAR: "Terminal",
    }

    interface PlaygroundData {
        id: string
        name: string
        icon: string
        starred: boolean
    }

    // This is including above icons 
    const formattedPlaygroundData: PlaygroundData[] = playgroundData?.map((item) => ({
        id: item.id,
        name: item.title,
        starred: item.starMark?.[0]?.isMarked || false,
        icon: techIconMap[item.template] || "Code2"
    })) || []


    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
                {/* DashBoard Side Bar */}
                <DashboardSidebar initialPlaygroundData={formattedPlaygroundData} />

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}   