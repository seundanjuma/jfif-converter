# jfif converter

a simple web app i built to convert .jfif image files to .jpeg or .jpg in batches.  

i built this because i was downloading files from the internet that i wanted to use, but my picasa photo viewer could not open .jfif files and adobe illustrator was having issues with them. this tool solves that problem in the browser, with no server required.

---

## features

- drag and drop multiple .jfif files  
- upload using a file browser  
- full-page drag overlay feedback while dragging files  
- batch conversion to .jpeg or .jpg  
- download all converted files as a zip  
- conversion progress bar  
- start over button to upload a new batch  
- client-only rendering avoids hydration warnings caused by browser extensions

---

## tech stack

- next.js 13+ with the app router  
- react with functional components and hooks  
- tailwind css for styling  
- jszip for creating zip downloads  
- filesaver for saving files client-side