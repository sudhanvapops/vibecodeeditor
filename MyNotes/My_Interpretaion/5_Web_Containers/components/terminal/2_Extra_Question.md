### Extra QUestions

- Why use forwerd re, ref and imparative methods instead of passing function to another compoent

Why not just pass functions as props?
<Terminal onWrite={someFunction} />

But this only works in one direction:
Parent → Child.

It does NOT work for:
- calling child instance methods
- accessing child’s underlying library instance (like xterm)
- triggering child actions from parent
- imperative control (focus, write, clear, resize)
- controlling UI state that lives inside child

React props are declarative
But terminals need imperative control.