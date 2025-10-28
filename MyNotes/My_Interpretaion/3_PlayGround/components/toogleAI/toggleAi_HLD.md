### What it does

Renders an AI button (Bot icon + status dot).

On click → Opens a dropdown menu with:
    Current AI status (active/inactive)
    Option to toggle enable/disable AI
    Option to open chat (AIChatSidePanel)
    Shows progress bar if a feature (like generating suggestions) is loading

### Key Features

onToggle() → Called when user enables/disables AI
suggestionLoading & loadingProgress → Shows progress for any ongoing AI process
activeFeature → Displays which feature is currently running
AIChatSidePanel → Opens a drawer-like side panel (probably the main AI chat interface)


### Core Components Used

It combines:
- Dropdown Menu — for settings and actions
- Button — main trigger for AI control
- Badge — AI status indicator (Active/Inactive)
- Progress Bar — feature loading progress
- AIChatSidePanel — main chat interface (drawer)
- Lucide icons — for visual feedback
- useCallback + useState — React hooks for state and optimization