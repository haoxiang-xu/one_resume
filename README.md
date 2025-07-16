<div align="center">
<img src="./assets/logos/logo_512_white_outline.png" alt="one-resume-logo" style="height: 128px">
  <h1>ONE resume</h1>
  <p>
    A platform that builds one perfect resume — every time, for every job.
</div>
<br>

## <h1>Table of Contents</h1>

- [Prerequisites](#prerequisites)
  - [setup a python environment with version 3.11.7](#setup-a-python-environment-with-version-31107)
  - [Setup a Node.js environment with version 23.0.0](#setup-a-nodejs-environment-with-version-2300)
  - [Setup npm version 11.1.0](#setup-npm)
  - [Download for Docker](#download-for-docker)
  - [Download for MongoDB](#download-for-mongodb)
- [Structure](#structure)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)

## <h1>Prerequisites</h1> <a id="prerequisites"></a>

[![Download for Python][python-shield]][python-url]
[![Download for Node.js][node-shield]][node-url]
[![Download for npm][npm-shield]][npm-url]
[![Download for Docker][docker-shield]][docker-url]
[![Download for MongoDB][mongodb-shield]][mongodb-url]

- [setup a python environment with version 3.11.7](#setup-a-python-environment-with-version-31107)
- [Setup a Node.js environment with version 23.0.0](#setup-a-nodejs-environment-with-version-2300)
- [Download for Docker](#download-for-docker)
- [Download for MongoDB](#download-for-mongodb)

### setup a python environment with version 3.11.7 <a id="setup-a-python-environment-with-version-31107"></a>

- **MacOS and Linux**

  ```bash
  #Before running the script, make sure you have python3 installed and in project root path
  #Redirect to the project code directory
  cd code
  #create a virtual environment
  python3 -m venv venv
  #activate the virtual environment
  source venv/bin/activate
  #install the required packages
  pip install -r requirements.txt
  #freeze the requirements if new packages are added
  pip freeze > requirements.txt
  ```

- **Windows**

  ```bash
    #Before running the script, make sure you have python3 installed and in project root path
    #Redirect to the project code directory
    cd code
    #create a virtual environment
    python -m venv venv
    #activate the virtual environment
    venv\Scripts\activate.bat
    #install the required packages
    pip install -r requirements.txt
    #freeze the requirements if new packages are added
    pip freeze > requirements.txt
  ```

### Setup a Node.js environment with version 23.0.0 <a id="setup-a-nodejs-environment-with-version-2300"></a>

- [![Download for Node.js][node-shield]][node-url]

  Download and install Node.js from the [official website](https://nodejs.org/en/download/) . Make sure to use version 23.0.0 or later.

### Setup npm <a id="setup-npm"></a>

- [![Download for npm][npm-shield]][npm-url]

  NPM is included with Node.js, so you don't need to install it separately. However, you can check the version of npm installed by running:

  ```bash
  npm -v
  ```

  If you need to update npm, you can run:

  ```bash
  npm install -g npm@latest
  ```

### Download for Docker <a id="download-for-docker"></a>

- [![Download for Docker][docker-shield]][docker-url]

  Download and install Docker from the [official website](https://www.docker.com/products/docker-desktop). Make sure to use the latest version. Make sure Docker is running before you start the application.

### Download for MongoDB <a id="download-for-mongodb"></a>

- [![Download for MongoDB][mongodb-shield]][mongodb-url]

  Download and install MongoDB from the [official website](https://www.mongodb.com/try/download/community). Make sure to use the latest version. Make sure MongoDB is running before you start the application.

[python-shield]: https://img.shields.io/badge/python-3.11.7-3776AB?style=for-the-badge&logo=python&logoColor=&labelColor=EBDBE2&color=3776AB
[python-url]: https://www.python.org/downloads/release/python-3117/
[node-shield]: https://img.shields.io/badge/node.js-23.0.0-339933?style=for-the-badge&logo=node.js&logoColor=&labelColor=EBDBE2&color=339933
[node-url]: https://nodejs.org/en/download/
[docker-shield]: https://img.shields.io/badge/docker-27.4.0-2496ED?style=for-the-badge&logo=docker&logoColor=&labelColor=EBDBE2&color=2496ED
[docker-url]: https://www.docker.com/products/docker-desktop
[mongodb-shield]: https://img.shields.io/badge/mongodb-7.0.20-47A248?style=for-the-badge&logo=mongodb&logoColor=&labelColor=EBDBE2&color=47A248
[mongodb-url]: https://www.mongodb.com/try/download/community
[npm-shield]: https://img.shields.io/badge/npm-11.1.0-CB3837?style=for-the-badge&logo=npm&logoColor=red&labelColor=EBDBE2&color=CB3837
[npm-url]: https://www.npmjs.com/package/npm

## <h1>Structure</h1> <a id="structure"></a>

### Frontend <a id="frontend"></a>

- **src**: Contains the source code for the frontend application.
  - **COMPONENTs**: Contains reusable components used throughout the application.
  - **CONTAINERs**: Contains context providers and other container components.
  - **PAGES**: Contains the main pages of the application.
    - **landing.js**: <span style="opacity: 0.32">The landing page of the application.</span>
    - **direct.js**: <span style="opacity: 0.32">The direct page for applicants.</span>
    - **register.js**: <span style="opacity: 0.32">The registration page for applicants.</span>
    - **auth.js**: <span style="opacity: 0.32">The authentication page for users.</span>
    - **user.js**: <span style="opacity: 0.32">The user profile page.</span>
      - **resume.js**: <span style="opacity: 0.32">The resume page for users.</span>
    - **admin.js**: <span style="opacity: 0.32">The admin dashboard page.</span>
  - **assets**: Contains static assets like images and icons.