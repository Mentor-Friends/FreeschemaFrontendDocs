## Querying compositions
Compositions need to be queried also. Querying compositions are done by using a construct in the querying system called "self". 

A composition is something that has something inside of it without connection types. These connections have type of its main concept/ the origin of the composition. 

Example


For this query we have created two compositions for table. one is 

This is example of a chair --- chair 1

![local_to_real_nodes](images/chair1.png)


This is example of a chair --- chair 2

![local_to_real_nodes](images/chair2.png)


Now we have to only query a chair that has 4 legs and not 3 legs

Then we need to create a query like

```
  // this is the query for composition data
  let selfdata = new FreeschemaQuery();
  selfdata.typeConnection = "self";
  selfdata.name = "selfdata";


 // this is the top query / start query 
  let freeschemaQuery = new FreeschemaQuery();
  freeschemaQuery.name = "top";
  freeschemaQuery.type = "the_chair";
  freeschemaQuery.outputFormat = DATAID;
  freeschemaQuery.inpage = 10;
  freeschemaQuery.limit = false;
  freeschemaQuery.freeschemaQueries = [selfdata];

  SchemaQueryListener(freeschemaQuery, "").subscribe((value: any) => {
    console.log('This is the data for the tables', value)
})

```

The output of this query is something like this.
![local_to_real_nodes](images/chairdataunfiltered.png)


Now we have to create a query to filter only chairs that have 4 legs and not 3 legs.


so we add a filter here.

```
  let filterLegs:FilterSearch = new FilterSearch();
  filterLegs.operateon = "selfdata";
  filterLegs.search = "4";
  filterLegs.type  = "the_legs";
  filterLegs.logicoperator = "=";
  filterLegs.name = "filterlegs";

  // this is the query for composition data
  let selfdata = new FreeschemaQuery();
  selfdata.typeConnection = "self";
  selfdata.name = "selfdata";


 // this is the top query / start query 
  let freeschemaQuery = new FreeschemaQuery();
  freeschemaQuery.name = "top";
  freeschemaQuery.type = "the_chair"
  freeschemaQuery.outputFormat = DATAID;
  freeschemaQuery.inpage = 10;
  freeschemaQuery.limit = false;
  freeschemaQuery.freeschemaQueries = [selfdata];
  freeschemaQuery.filters = [filterLegs];
  freeschemaQuery.filterLogic = "( filterlegs )";
  freeschemaQuery.selectors = ["self"];


  SchemaQueryListener(freeschemaQuery, "").subscribe((value: any) => {
    console.log('This is the data for the tables', value)
})


```


Now we only have the filtered data

![local_to_real_nodes](images/FilteredDataComposition.png)


