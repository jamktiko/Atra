# README file for Atra-frontend implementation

This README-file will give step-by-step instructions on how to set up Angular/Ionic frontend-environment. When installations are through, clone git repository to your computer to run locally.

## Copy repository locally

Clone git repository to your computer to run locally.

## How to install prerequisities

Before downloading Ionic and Angular, update Node.js (requires v.20.19.0 or newer). Might get error "This project requires Node version X". First run

- node --version

If less than verison 20, you need to update. Go to https://nodejs.org/en/download/package-manager/all#nvm and download install script. Run the nvm-setup.exe-file and coplete installation. After, check for version and verify installation with

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
