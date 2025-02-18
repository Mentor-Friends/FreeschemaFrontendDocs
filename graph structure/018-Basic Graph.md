## Creating a graph / Composition


<strong>What is a composition ?</strong>

A composition is a concept which has a group of connections connected with it. A composition is used to denote a data structure that is complex and denotes a complex information. If you are familiar with a table in a structured databases then this would be somewhat similar to a row in the table.

A composition can be anything, a user, an item, a classroom etc. These all are a data point and have some sort of data connected with it. Multiple compositions can then be connected with each other by connection types which can then create a very large, densly connected network of information.

In freeschema, a concept is only created once, a compositional instance is created everytime, a new connection is created everytime.

<strong>What is a type ?</strong>

For any kind of data, a type is something that gives it meaning. For a value of "ram" the type is <b>the_name</b>. So we know by the type that the data is of the type name.
So in freeschema these types are defined by the user. Everytime you need to use the type you will use function such as "MakeTheTypeConcept" and if it's already built in the system it will return that else it will create a new type and give you that.




## Rules of concepts and connections.


Graphs/Composition are data chunks that could be built using the concept connection system. You could create complex graphs and simple graphs but they just hold information. We have a convention that all the types in our system start with "the_".

<b>The different conventions in our system are</b>
1. All the types start with "the_";

2. All of the connection types have the following structure 
<strong>Prefix : Type of the (of_the_concept) </strong> for eg. in the connection the_entity_name. The of_the_concept is "the_entity".

3. All the suffix / connection type is related to the (to_the_concept)
<strong>Suffix : Type of the (to_the_concept) </strong> without the "the_"; For eg in the connection the_entity_name. the_name is the to_the_concept.

4. The orderId for connection types are 1000. (This is how we are doing it no apparent reason just for programming complexity).

5. accessId for the concepts for users are 4. This will be updated in the future.

6. Compositional instances are mostly kept unique so that it does not clash with the types.

<strong>In case that you want to create compositional objects (i.e. only internal connections to the composition)</strong>

1. typeId must be the type of the main composition.

2. orderId for composition must be 2.


## Access Control 

No matter which user Id you use in creating concepts and connection the userIds will be set in the backend by node server as per your access token.



