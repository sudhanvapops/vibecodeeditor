### scrollToBottom


- To use the browser's native scrollIntoView() method in React, you need to first obtain a direct reference to the target DOM element using the useRef hook, and then call the method on the ref's current property
- Make ref 
- attach to the dom where the scrollToBottom Needed


What it does:
Keeps chat scrolled to latest message.
messagesEndRef is attached to a sentinel <div ref={messagesEndRef} /> at bottom of message list.
When messages or isLoading changes, effect runs: schedules scrollToBottom() after 100ms.


Why the timeout
Ensures layout has updated (images, fonts, markdown rendering) before scroll. 100ms is a pragmatic delay to let DOM settle.



<!-- Todo -->
Race: setTimeout may be unnecessary if you call scrollIntoView in a layout effect (useLayoutEffect) — that runs after DOM mutations but before paint. Using useLayoutEffect avoids need for timeout.

behavior: "smooth" may be undesirable for rapid successive messages (user wants immediate jump). Consider behavior: messages.length > prev ? "smooth" : "auto" or using a short debounce.

If chat is large, scrolling frequently can be costly. Consider only auto-scrolling when the user is already near bottom.