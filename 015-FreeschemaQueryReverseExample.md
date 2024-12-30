<h1>FreeschemaQuery Reverse Example</h1>

Let's suppose you have a connection such as this.

![local_to_real_nodes](images/public%20reverse.png)

Here you have a connection from the main data to the copy of the data. Which then eventually are reversed connected to the connection called the_public_widget.

This is a type of example where you have to query something in the reverse order. In this example. There are widget code which are published by the user and these are then connected to the the_public_widget.


To execute this query we call this function.

```
    let filters = new FilterSearch();
    filters.type = "the_public_widget";
    filters.search = '';
    filters.operateon = "public";
    filters.name = "publicfilter";
    filters.logicoperator = "=";

    let allPublic = new FreeschemaQuery();
    allPublic.typeConnection = "the_public_widget_s_widget_code";
    allPublic.freeschemaQueries = [];
    allPublic.name = "public";
    allPublic.reverse = true;

    let allCopyWidgets = new FreeschemaQuery();
    allCopyWidgets.typeConnection = "the_widget_code_s_copy";
    allCopyWidgets.name = "copywidgets";
    allCopyWidgets.selectors = ["the_widget_code_name", "the_widget_code_html", "the_widget_code_css"];
    allCopyWidgets.freeschemaQueries = [allPublic];

    let allWidgetCodes = new FreeschemaQuery();
    allWidgetCodes.typeConnection = "the_entity_s_widget_code";
    allWidgetCodes.name = "mywidgets";
    allWidgetCodes.selectors = ["the_widget_code_name"];
    allWidgetCodes.freeschemaQueries = [allCopyWidgets]

    let freeschemaQuery = new FreeschemaQuery();
    freeschemaQuery.conceptIds = [entityId];
    freeschemaQuery.freeschemaQueries = [allWidgetCodes];
    freeschemaQuery.inpage = 100;
    freeschemaQuery.filterLogic = "( publicfilter )";
    freeschemaQuery.filters = [filters];
    freeschemaQuery.outputFormat = DATAID;
    SchemaQueryListener(freeschemaQuery,"").subscribe((data:any)=>{
        console.log("this is the data for public", data);
    })


```