# PFG
Final degree project for Fernando Barroso Medina
This project is a multi module solution that in combination produces an application that carries out all processes
defined in the memory. This app is currently hosted and available through the follwing link: 
https://pfg-three.vercel.app

Code found in this file is not executable localy in its whole and depends on being deployed as three separate entities:

Backend: Can be directly deployed

Middleware: JSON Files must be imported into a N8N instance, in order to achieve full functionalities API keys for both Airtable and Alpaca API must be configured.
given that these were introduced as credentials in N8N cloud and not hardcoded into nodes as a key protection good practice.

Frontend: Can be directly deployed, can also be locally be run using standard npm run dev command for apps of its category, running the app in localhost allows for
full functionality of this section.

