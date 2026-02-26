1. virtual filesystem backed by IndexedDB
2. Integrate isomorphic-git with a browser-compatible FS implementation like LightningFS for full Git features such as cloning, committing, branching, and diffs directly in the browser.

Why Virutaual isnide browser insted of real fs
they choose based on reliability + portability + collaboration.

Permission
Collabaration become hard 

Real filesystem writes are not transactional.
You Lose Local-First Guarantees
IndexedDB gives:
✅ atomic writes
✅ transactions
✅ rollback safety


With Replicated FS

Cloud
  ↕
Local Replica (IndexedDB)
  ↕
Editor

Now syncing becomes natural.

disk access is surprisingly slow

Multi-Device Sync
Real filesystem exists only here: Laptop A
But modern expectation: 
Laptop
Phone
Tablet
Browser

Replica model allows:
Any device = local copy
