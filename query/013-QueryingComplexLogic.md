## Querying Filter Logic

Filtering in a graph database is a relatively easy task. We have to find the nodes that we want, filter them and then return the data.

When filtering you will encounter lots of issues but as the system is being developed we will root out the issues.


When you add a filter the filter will select the node that the filter applies on and then return the root path(the straight path to the root) and nothing more than that. We need to then use selectors/ include in filter logic to then include those things in the filter.

Freeschema query stages

Since we are querying a complex structure the querying mechanism also starts with mimicing the structure. We have to build the freeschema query in such a way that the query represents the structure that you are querying. So the query is also a graph.

There are multiple stages in querying for the freeschema.

1. Create the query: The query represents the data.

2. Collect all the concepts and connections in memory. When the user sends the query to the backend(data layer) the data layer collects all the concepts and connections and creates an in-memory graph which represents the actual data. We have to create sepecefic query from conceptids for better result. If we do type queries(searching by type rather than id) then we will have to collect huge number of data in memory which will take time. Our querying system is such that connections are stored in memory so the 2nd time you query something it will be faster due to connection caching.

3. Check for filter: If any filters are applied to the query then we will check the filter and only return things that are needed to return. If filter is not applied we send all of the data that has been collected in the form of concepts and connections.

4. Format the output: If any selectors are applied on the query node, if limit is applied, if order is applied on the node then we apply these kinds of formatting in this section. This is helpful because we do not have to pull unwanted data in case of filtering. We also count our data in here.

5. return the output: after we have fetched all the relevant data we convert them to concept and connection ids and then send to the frontend.

6. Format in json format: For the ease of use for developers we have assigned some formats to our data. We then conver these concept and connection ids to a json format such as DATAID , JUSTDATA, NORMAL etc.


