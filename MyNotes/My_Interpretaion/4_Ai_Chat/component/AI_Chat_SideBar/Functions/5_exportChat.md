### Export Chat

What it does
Serializes messages to JSON and triggers a client-side download of a .json file.

1. Blob

A Blob (Binary Large Object) is a special JavaScript object that holds raw data (like text, images, JSON, files, etc.) in a binary format.


Blob (Binary Large Object)
Creating downloadable content: You can create a Blob from data and then generate a Blob URL using URL.createObjectURL() to allow users to download it.

Here blob represents a virtual file (JSON) in memory — which you can download or upload without saving it physically.