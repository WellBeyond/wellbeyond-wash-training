### Reading and Writing Firestore Data
Each type of data is accessed via the code in a separate subdirectory of the
data directory (e.g. maintenance, training) and maintained in a separate subtree
of the application state.  Each type of data also has its schema defined in its own
file in the models directory.  This document is the basic recipe for adding a new type 
of data to the application.

#### Define the schema

Create a new file in the `src/models` directory where you will create an interface for each
of the document types in Firestore and for any subdocuments that are contained or any 
enumerated values used.

#### Define the state

For any type of data, the application state is generally going to contain a combination of
configuration data that is created by the admin (and conversely not updated by the end user) 
and working data that is created/updated by the end user.  The state for the `foo` data
should be defined in a file called `foo.state.ts` in the `src/data/foo` subdirectory.

The pattern so far has been to load the configuration data (e.g. systems, checklists, subjects, lessons)
for an organization when the user logs in and store them as arrays in the state.  The working data
could be either specific to a user or for all users in an organization, might be limited in scope to 
only recent or only active data, and is generally stored in a hashmap since it is updated as the user
performs actions in the application.  

You will hook the subtree that you have defined for this new data type into the application state
tree and initialize it in the file `src/data/state.ts`.

#### The Firestore API

The API to Firestore is a lot different from most databases.  Here are some of the highlights of how
it is used in this application:

*  Data is read by creating a query then listening for changes to the results of that query using
   the `query.onSnapshot` method.  If the data in the Firestore database changes, it will automatically
   be refreshed in the application.
*  The `onSnapshot` method does not return the data from the query; it returns a function that can 
   be called to cancel the listener.  The listeners need to be canceled if we change what we subset
   of the data we are listening for (e.g. when a user logs off and logs back on as someone else).
*  When you read a document from Firestore, doc.data() returns all the data except for the Id of the
   document.  That is why you see the pattern of setting something to `{id: doc.id, ...doc.data()}` in
   almost every function that reads data.
*  When writing data, we want to be able to continue working if the user's device is disconnected
   from the network.  For that reason, we don't wait for writes to complete.  If the device is disconnected,
   then the write will actually be cached on the device and will complete when it reconnects.  This is
   a Firestore feature that is one of the major reasons for using it.
*  Because we don't wait for the writes to complete, we never allow Firestore to generate a unique ID
   for us.  Since we don't wait for the write to complete, we wouldn't know what the generated ID is 
   for that record if we want update it.  The ID generated is usually a combination of one or more IDs
   from the user or associated configuration data combined with a timestamp to make it unique.
*  Note that the API code has to implement the same security rules as the firestore.rules.  For example,
   non-administrative users can only read data for their organization, so the query must specify the
   organizationId in its where clause.  Remember Firestore security rules operate as an all or nothing
   gate not a filter of individual documents.
*  Images and videos are precached when documents containing the URLs are loaded.  This allows the web (PWA)
   version of the application work better offline.  Note that precaching in an Android or IOS application
   is more complicated and is not currently being done.
   
The API code for the `foo` type of data should all be in `/src/dat/foo/fooApi.ts`.  The methods will
almost always be defined as async, and typically are only called via the actions class for that same
data type.

#### Data Actions

Actions are dispatched by the UI code to change the state of the application.  The action code for
the `foo` type of data should be in `/src/data/foo/foo.actions.ts`.  There should be some "primitive" actions
that only manipulate the application state, and some "complex" actions that call the Firestore API and then
use the other actions to update the application state.

One of the actions is typically to load the admin configured data for the user's organization.  It follows
a pattern where it will cancel an existing listener for a particular collection, then create a new listener
for that collection passing in a callback function that then dispatches the simple action to update the
state with the result.

There is also going to be an action that writes the user-modifiable data.  It will use the API to update
Firestore and then dispatch the action that updates the state.

#### Reducers

Each data type has its own reducer to update its subtree of the application state.  The reducer code for
the `foo` type of data should be in `/src/data/foo/foo.reducer.ts`.   The reducers are all combined
when the combineReducers function is invoked from `/src/data/state.ts`.  


