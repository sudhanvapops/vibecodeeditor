### setupContainer

PURPOSE OF setupContainer()

This function performs a 4-step build process:

Step	What it does	                                Why it's needed
1	    Transform template into WebContainer format	    WebContainer accepts nested {file, directory} objects
2	    Mount files into WebContainer	                Create actual project structure inside VM
3	    Install dependencies (npm install)	            Prepare node_modules for app to run
4	    Start development server	                    Boot Vite/Next/Node/etc inside VM

Additionally, it:

prints logs to terminal
handles errors
updates progress UI
manages “already setup” sessions
connects to existing dev server if found
handles cleanup

This is the heart of your IDE.



### Detect existing WebContainer project

checks If project was already installed before
The user is returning to an existing WebContainer session
Files already mounted
npm install already done
Dev server might still be running

Why read Pacakge.json
Because if it exists, the project filesystem is already mounted.


### Pipe Line

1. Transform Data
Convert your JSON template structure into WebContainer’s required FS format.


2.  Mount Files
This places ALL project files into the VM filesystem.
You must do this BEFORE installing dependencies.


3. Install Dependencies

run npm install
inside WebContainer.

Streaming output
Allows user to see output of 

If npm fails → throw error and stop pipeline.


4. Start Dev Server

runs npm run start
listen to an emitted event server-ready
and display the url in terminal



