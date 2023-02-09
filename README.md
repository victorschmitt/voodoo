# Candidate Takehome Exercise
This is a simple backend engineer take-home test to help assess candidate skills and practices.  We appreciate your interest in Voodoo and have created this exercise as a tool to learn more about how you practice your craft in a realistic environment.  This is a test of your coding ability, but more importantly it is also a test of your overall practices.

If you are a seasoned Node.js developer, the coding portion of this exercise should take no more than 1-2 hours to complete.  Depending on your level of familiarity with Node.js, Express, and Sequelize, it may not be possible to finish in 2 hours, but you should not spend more than 2 hours.  

We value your time, and you should too.  If you reach the 2 hour mark, save your progress and we can discuss what you were able to accomplish. 

The theory portions of this test are more open-ended.  It is up to you how much time you spend addressing these questions.  We recommend spending less than 1 hour.  


For the record, we are not testing to see how much free time you have, so there will be no extra credit for monumental time investments.  We are looking for concise, clear answers that demonstrate domain expertise.

# Project Overview
This project is a simple game database and consists of 2 components.  

The first component is a VueJS UI that communicates with an API and renders data in a simple browser-based UI.

The second component is an Express-based API server that queries and delivers data from an SQLite data source, using the Sequelize ORM.

This code is not necessarily representative of what you would find in a Voodoo production-ready codebase.  However, this type of stack is in regular use at Voodoo.

# Project Setup
You will need to have Node.js, NPM, and git installed locally.  You should not need anything else.

To get started, initialize a local git repo by going into the root of this project and running `git init`.  Then run `git add .` to add all of the relevant files.  Then `git commit` to complete the repo setup.  You will send us this repo as your final product.
  
Next, in a terminal, run `npm install` from the project root to initialize your dependencies.

Finally, to start the application, navigate to the project root in a terminal window and execute `npm start`

You should now be able to navigate to http://localhost:3000 and view the UI.

You should also be able to communicate with the API at http://localhost:3000/api/games

If you get an error like this when trying to build the project: `ERROR: Please install sqlite3 package manually` you should run `npm rebuild` from the project root.

# Practical Assignments
Pretend for a moment that you have been hired to work at Voodoo.  You have grabbed your first tickets to work on an internal game database application. 

#### FEATURE A: Add Search to Game Database
The main users of the Game Database have requested that we add a search feature that will allow them to search by name and/or by platform.  The front end team has already created UI for these features and all that remains is for the API to implement the expected interface.  The new UI can be seen at `/search.html`

The new UI sends 2 parameters via POST to a non-existent path on the API, `/api/games/search`

The parameters that are sent are `name` and `platform` and the expected behavior is to return results that match the platform and match or partially match the name string.  If no search has been specified, then the results should include everything (just like it does now).

Once the new API method is in place, we can move `search.html` to `index.html` and remove `search.html` from the repo.

#### FEATURE B: Populate your database with the top 100 apps
Add a populate button that calls a new route `/api/games/populate`. This route should populate your database with the top 100 games in the App Store and Google Play Store.
To do this, our data team have put in place 2 files at your disposal in an S3 bucket in JSON format:

- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json
- https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json

# Theory Assignments
You should complete these only after you have completed the practical assignments.

The business goal of the game database is to provide an internal service to get data for all apps from all app stores.  
Many other applications at Voodoo will use consume this API.

#### Question 1:
We are planning to put this project in production. According to you, what are the missing pieces to make this project production ready? 
Please elaborate an action plan.

Before putting this project in production I would look into these features :
 - Adding security : currently the api is open so anyone can access or delete data. I would look into different level of authentication, maybe a simple signed jwt with different roles to allow reading or writing.
 - Switching database engine : I'm no expert with sqlite, but I think it can become very limiting outside development context. I would use a managed sql database engine to avoid refactoring while allowing more features like replication, easiest backup and monitoring
 - Integrating to the existing infrastructure: I would try to integrate the project in the current infrastructure (create an image and a deployment for a Kubernetes cluster, adding a domain name to the DNS, integrating the app with existing APM)
 - Integrating to the current CI/CD environment

Some optimisations might be necessary before production if we want to quickly scale the data or the number of consumers
 - Optimising database schema : the current schema doesn't seem to have any indices outside the primary key, I would at least add indices on the fields used for the search. I would also look into fulltext indices to replace the simple LIKE operator (if we are looking to list a lot of apps)
 - Enforcing pagination : Currently the API shows the whole database, if we want to preserve performance while adding new app data we need to enforce a limit to the number of apps returned by a single call.
#### Question 2:
Let's pretend our data team is now delivering new files every day into the S3 bucket, and our service needs to ingest those files
every day through the populate API. Could you describe a suitable solution to automate this? Feel free to propose architectural changes.

I would use a S3 trigger on file creation to push messages in a SQS queue. A kubernetes worker from my application will receive the message and process the file.
It might be interesting to add another bucket to store processed files to keep history (or allow replaying if there was an error) instead of deleting them after processing.
If there are a lot of files dropped it might be necessary to parallelize the processing, by first moving a file to a "processing" bucket to reserve it. Allowing multiple workers to works of the "to be processed" bucket

Using the application instead of a dedicated lambda to process files allows us to share functions if we want to allow data creation using the API. It also centralize database writing responsibility
#### Question 3:
Both the current database schema and the files dropped in the S3 bucket are not optimal.
Can you find ways to improve them?

For the database:

As stated above there are indices missing in the database schema. In addition to the performance indices I would add some data integrity indices.
For instance an app can be stocked multiple times. I think a unique index is needed either on storeId or storeId + platform (if there is some platform with common storeId)

For the files:
 - I found some encoding issues with the data extracted from the file. We should look into the data collection.
 - It looks like there is an unnecessary level in the json. We could put all app objects int the top level array instead of splitting them into several arrays
Some fields seem redundant ?

