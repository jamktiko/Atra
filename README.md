# README file for Atra-frontend implementation

This README-file will give step-by-step instructions on how to set up Angular/Ionic frontend-environment.

## Copy repository locally

Clone git repository to your computer to run locally.

## How to install prerequisities

Before downloading Ionic and Angular, update Node.js (requires v.20.19.0 or newer). Might get error "This project requires Node version X". First run

- node --version

### NOTE: This is not necessary if npm install goes through without nvm! Try with - npm install -g npm

If less than version 20, you need to update. Go to https://nodejs.org/en/download/package-manager/all#nvm and download install script. Run the nvm-setup.exe-file and coplete installation. After, check for version and verify installation with

- nvm -v

If you get a version number, set up was successful. Install latest version with command

- nvm install latest

Afterwards, check version with nvm -v and see that it is newer version than earlier. Now, update latest verion of npm with command

- npm install -g npm

## How to install required frameworks

Now you need to install Ionig and Angular.

- Install Angular CLI: npm install -g @angular/cli
- Install Ionic CLI: npm install -g @ionic/cli

And ensure that you have atleast Ionic version 7 & Angular version 20. You can check with following commands:

- ng --version (expected output 20.x.x)
- ionic --version (expected output 7.x.x)

## Running locally

Go to project root file and run following commands

- npm install
- ionic serve (starts developer mode in localhost:8100)

## Tests

Go to project root file and run the following command:

- _npm run test_

This runs Jasmine tests.

To run only Jest tests, run commands:

- _cd backend_
- _npm test_
- !!Remember to move back to project root if needed!!

To run Cypress tests run the following command in project root:

- _npx cypress run_
  or
- _npx cypress open_
- !!! For Cypress-tests to run, you need to run ionic serve !!!

To make your life easier, create a Powershell profile, and add the following script:

function nameHere {
Set-Location 'projectRootHere'
npm run test
Set-Location 'projectRootHere/backend'
npm test
Set-Location 'projectRootHere'
}

- Replace _nameHere_ with the desired name. Replace _projectRootHere_ by the absolute path of your working directory.
- You call the function by the name you give.
- Don't forget to close Powershell after adding functions, or they won't work!
- This script runs Jest and Jasmine tests, and then returns you to project root.
