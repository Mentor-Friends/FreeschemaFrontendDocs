## Architecture

Freeschema architecture is a distributed architecture. This architecture has multiple layers which interact with each other in the same language(The Semantic Concept Connection System). Freeschema has basic 14 data structures and the main intelligent structures are concepts and connections. 
We have structures that define user, images, charactes, numbers etc. But these are how the data is stored in the background. For a developer they just need to interact with 2 data structures.
1. Concept - Think of it as a node in a graph.
2. Connection - Think of it as an edge in a graph.

Basically Freeschema interacts within itself in graph notations(i.e concepts and connections)

![local_to_real_nodes](./images/Freeschema-architecture.svg)


* Layer 0(Permanent Store Layer) : Here Layer 0 is the permanent data store. This is where all the final data resides in disk.
* Layer 1(Data Layer) : Here the data manipulation and final hop for the data is created before it joins the permanent store. This does all the heavy lifting for our data searching, session management etc.
* Layer 2(Access Layer) : This is a user specefic layer. A server layer that handles authentication, roles, access control etc as per the requirements.
* Layer 3(User Layer) : User layer is where the user interacts with the concepts connection. You can create data, widgets etc here and that gets filtered through the upper layers for the final store.

<h3> How concepts are created ? </h3>

Concepts are the building blocks of freeschema. Concepts are created mostly in the User Layer(Layer 3) where the user interacts with freeschema and then afterwards it is passed to the Access Layer where all the access controls and handled. After a proper access control to the data has been attached. Then it passes onto the Data layer where it checks the data integrity and data duplicity after which the concept finally is stored into the permanent store layer.


<h3> How connections are created ? </h3>

Connections are the data points that connect other concepts, these have a specefic type that distinguish them from each other. After the user creates connections in the user layer(Layer 3) the connection is passed onto the access layer which checks and inserts the access intelligence into it. After that it is passed onto the data layer which will then store the connection properly to the permanent data store.



<h3> Advantages of having concept and connection over other data structures ? </h3>

There are many advantages of having concepts and connection as the main means of communication between different layers. 
1. Minimal Data Transfer -> Once you have pulled all the concepts and connection to your layer then it is stored in a memory tree. A memory tree is a store in the layer which stores the concept and connection in its memory for faster access. So once a concept/ connection has been transferred to the memory tree. Next time you do not need the data transfer from any database/ cache/ data store because it is already contained in memory of the layer. Having multiple layer with multiple memory tree also ensures that least amount of read is conducted on the slowest layer i.e. Permanent Data store. This will help us save time in fetching data from the disk and also save us a lot in network bandwidth because we only transfer delta concept and delta connections (which are not present in the memory tree).

2. Single Point of Data Manipulation -> You can create any type of data structure using the concept connection paradigm. All complex json, text, numbers, objects, arrays etc can be created via the concept connection system. Think of concept and connection as the atomic structure of data. These are the building blocks of the data in freeschema.

3. Data Normalization -> Data by its nature has repeating factors in it. Freeschema is a working system that helps normalize the data as much as possible. Since it is atomic structure of the data then the concepts that build the data are not repeated in the store but they are reused when possible.

4. Searching -> Data by itself has many relation that are not known when it is created. The concept connection paradigm allows us to search unkonwn relations in data.




