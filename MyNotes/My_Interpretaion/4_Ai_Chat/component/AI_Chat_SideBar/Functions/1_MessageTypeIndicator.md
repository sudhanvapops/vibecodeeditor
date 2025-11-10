### Message Type Indicator

- used in chat replies

const MessageTypeIndicator: React.FC<{ type?: string; model?: string; tokens?: number; }> = ({ type, model, tokens }) => { ... }


What it does:

Small presentational component that shows:
    an icon (Code, Sparkles, RefreshCw, Zap, MessageSquare) depending on type.
    a small label (e.g. “Code Review”, “Chat”).
    optionally displays model and tokens on the right.
getTypeConfig(type) maps type → { icon, color, label }.
Renders layout: left (icon+label), right (model + tokens).


<!-- Todo -->
type string must match expected values
otherwise default used.
Could memoize getTypeConfig if expensive (not needed).
If tokens or model are large, consider truncation or tooltip.