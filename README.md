# UTD Grades

![Deploy to Production](https://github.com/bharatari/utd-grades/workflows/Deploy%20to%20Production/badge.svg?branch=master)
![Deploy to Development](https://github.com/bharatari/utd-grades/workflows/Deploy%20to%20Development/badge.svg)
![Test](https://github.com/bharatari/utd-grades/workflows/Test/badge.svg)

UTD Grades is a tool to view grade distributions at UT Dallas.

## Components

This monorepo consists of 4 sub-projects split into the core application and side utilities.

Core Application:

- The `client` folder contains the project's front-end built with React and Next.js
- The `functions` folder contains the project's backend code built as Node.js AWS Lambda functions with the Serverless Framework

Side Utilities:

- The `converter` folder contains a Python script that converts the Excel file of grade distributions into a JSON file fitting our own data format
- The `loader` folder contains Node.js data loading script that loads the converted JSON file of grade distributions data into PostgreSQL

There is also a `data` folder that contains all currently received grade data with the original Excel files and converted JSON files.

## Development

Development steps are listed within each module's README.

## Deploying

The two parts making up the core application are the `client` and `functions` modules. The deployment process for both are separate, allowing changes to be made to each service independently from the other.

Deployment steps are listed within each module's README.

## Uploading New Data

To upload new grade data received from UTD, the data will first need to be converted from Excel in JSON. To do this, use the `converter` Python script.

First we'll need to install all the necessary dependencies for the script.

1. Change directories into the converter folder
2. Run `python -m venv venv` to create a virtual environment (use `py` instead of `python` if using Python Launcher on Windows)
3. Run `venv/bin/activate` to activate virtual environment
   1. `venv\Scripts\activate` on Windows
4. Finally run `pip install -r requirements.txt` to install all dependencies

Now the `converter` script is ready to run.

1. Load the received Excel file into the `converter/data/data.xlsx` file location. The filename must match `data.xlsx` exactly.
2. Ensure the `output` folder is empty.
3. Within the `converter/main.py` script, edit the TERM constant to match the name of the semester of the data you are uploading. For example, the TERM constant should contain `2018 Fall` for fall 2018 grade data.
4. Run the script with `python main.py`
5. Check for any errors and fix them accordingly. These errors could occur if the Excel file varies slightly from the our expected format. Check the names of the columns and check for any spelling mistakes.
6. If all goes well, you should see an output file in the `output/output.json` file location.
7. In the `data` folder make sure to create a new folder for this semester's data and place the original Excel file as well as the converted JSON there for safe-keeping.

Now we must take our converted JSON and actually upload it to our PostgreSQL database using the `loader` Node.js script. First we'll need to install all the necessary dependencies for this script.

1. Change directories into the `loader` folder
2. Run `npm install`

Now the `loader` script is ready to run

1.  Create a `.env` file in the `loader` folder and enter the database credentials for the UTD Grades database

        dbName=database name goes here
        dbUser=username goes here
        dbPass=password goes here
        dbHost=host goes here

2.  Take the outputted JSON file from the `converter` script and place it in the `loader/data` folder.
3.  Within the `loader/index.js` file, edit the name of the file location to match the JSON file you're loading.
4.  Run the script with `npm start`

The script should output the records it was not able to upload. Keep track of
these so you can fix whatever issue may have occured with those specific records
and re-upload them later. Sometimes there are quirks with professor names that
cause issues on our end. Some professors are included in the dataset with no
first name, which causes a problem with our parsing. For these, just look up the
professor to get their first name and edit the records accordingly. When you
re-upload, don't re-upload the whole JSON file again. Instead only re-upload the
specific records that didn't upload the first time by placing them into a
separate `errors.json` file (in the `loader/data/` folder). Then, edit the
`loader/index.js` script to read the `errors.json` file instead of the whole
semester JSON file. This is just to prevent data that uploaded properly the
first time from getting messed with.
