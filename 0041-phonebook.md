# Phonebook Example


This example is meant to teach a beginner in the concept connection system how to create widgets, how can you create a concept connection inside of the widget and how can you create a simple application using this knowldge.

Firstly we will try to create a CLUD application. This CLUD application has a create, List & Delete, Update sections. Hope you will find this example useful in learning concept and connection.

For this example we will just need 3 ideas of concept connection system.

1. How to create a concept ( Compositional and Instantial) ?
    *  Use the function provided to you MakeTheInstanceConceptLocal.
2. How to create connection between two concepts ?
    * Use the function provided to you MakeTheConnectionLocal.
3. How to save the concept and connections ? 
    * Use the function provided to you LocalSyncData.SyncDataOnline().
4. How to List the compositions/concept by type ? 
    * Use the function provided to you GetCompositionListListener.
5. How to Update the composition ? 
    * Use the function provided to you UpdateComposition.

All of the functions provided are part of mftsccs-frontend package in npm which is automatically installed inside of the project https://github.com/Mentor-Friends/Freeschema-Frontend

<b>You can find all the final code inside of the project in the folder src/app/pages/example section.</b>
