# _PERSEUS_

Perseus is a webtool for the interactive visualization of pedigrees represented as directed forced graph networks

## How to run the app
### Web server
#### Requirements
- Node (tested on v16.19.0 and v17.4.0)
#### Steps
1. `cd scripts`
2. `npm install`
3. `npm run start`

The server runs by default at localhost:3000.

The dependencies versions have been fixed. 

### Graph database
For our graph database we use [Neo4j](https://neo4j.com) an open-source graph database. It has a headless server version for RedHat [(link to the download area)](https://neo4j.com/download-center/) we use version 5.

The connection to the database is created in the file `scripts/data/grap-db.js`. The parameters that are set are the database location and the credentials to the database. They have to match your neo4j's database values.

To check if the web page has been able to connect to the database, when accesing the "Discover Pedigrees" page, a graph should appear. If there are any errors, no graph will appear and the browser's developer console will display errors.

### Website images and resources database
The website stores images and resources in a mongoDB database that has to be run alongside the website. The dump of the mongoDB database can be found in `db/storedImages.json`. Create a database named `perseus-pedigree` and a collection `storedImages`. To import the data for this collection follow https://www.mongodb.com/docs/database-tools/mongoimport/#examples with the provided database dump.