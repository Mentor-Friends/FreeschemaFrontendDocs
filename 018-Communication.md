## Communication between two widgets


A widget is anything that has a lifecycle and it's own properties. A widget can work in multiple ways and can be used with data fabric, without any data, use API's etc. The widget can set Properties of other widgets in multiple ways. 

Communication as objects:
A widget basically is an object of StatefulWidget which has multiple properties, we can also extend this class to add new properties and methods to it. 

The properties of the StatefulWidget are
```
    /**
    * This can hold any kind of data inside of the widget.
    */
    data: any;

    /**
    * Used for internal use
    */
    inDevelopment:boolean = false;

    /**
     * This is the subscribers of the data. If any thing on this widget changes then all the functions
     * in the subscribers are called.
     */
    subscribers: any = [];

    /**
     * This is the element that is a copy of the element that is mounted.
     */
      element: HTMLElement | null = null;

    /**
     * This is a random identifier to the widget that is used to identify the widget and other elements
     * inside of it.
     */
    elementIdentifier: number = 0;

    /**
     * This flag is set to denote that that widget has been mounted
     */
    widgetMounted: boolean = false;

        /**
     * These are the child widgets that need to be added to  this widget
     */
    childWidgets: any = [];

    childWidgetElement: any = [];

    /** 
     * store widget state datas to pass through child widgets
     */
    widgetState: { [key: string]: any } = {};

    /**
     * This is the id of the parentElement of this widget.
     */
    parentElement: string = "";

    /**
    * Has the html elements for the widget
    */
    html: string = "";

    /**
    * Has the css elements for the widget
    */
    css:string = "";

    /**
     * This function will be called after the widget mounts and before render().
     */
    before_render();

    /**
     * This is called after the render function has been called. So this is used for the user functions to be added
     * for the widget and its html element. User can add any logic here.
     */
    after_render();

    /**
     * 
     * @param parent This is the function that creates a new div and then mounts the html element to the parent.
     * This also creates a unique identifier wrapper around.
     */
    mount(parent: HTMLElement);


```

**Parent Child Relationship:** Communication between widgets can happen firstly when they are parent and child. Parent child relationship can also happen in two ways. If you are using the WidgetConceptualizer you probably drag and drop widgets inside of one another then these widgets are constructed with parent child relationship in mind. So these kind of widgets have a childWidgets properties which can be access by this.childWidgets:StatefulWidget[] property.

If you have rendered Child Widgets which are dynamic widgets in which child widgets are dynamically added by code should be tracked by the developer.


**Why Track child ?**

So we know that widgets have a parent and child relationship which help them track all of their child widgets. So what can we do with it ? Well we have some methods in the Stateful Widget object that helps us to track data changes between widgets.

```
setStateProperty({});

```
setStateProperty is a function used to update a specific property of a widget. It also checks whether the property has actually changed before triggering an update. For example, if a widget has a property called inpage, calling myWidget.setStateProperty({inpage: 10}) will update the widget only if the inpage value is different from its current value. Otherwise, no update occurs.


```
setState({});

```
the property data inside of the statefulWidget is a really important data container as this might contain other data points which the user defines and which the user uses, so in the case that these need to be changed we use this setState to change the property inside of the data object which if changed changes calls the render() function.



```

dataChange(callback:any)

```

dataChange is a property within the widget that allows you to register callback functions. These callbacks are triggered whenever setStateProperty results in a data update. It’s useful for responding to changes by executing custom logic when the widget's data is modified.



```
notify();

```

notify() is a property of the StatefulWidget that allows you to manually trigger a re-render of the widget. Unlike setState, it doesn’t rely on any changes in state—it forces a rebuild regardless of the current state.



**Data Subscribers**

What are DataSubscribers? They're a mechanism we use to retrieve data from the data fabric. Think of them as an early, low-level form of a query that the system uses to interact with data. These queries also act as a data binding tool, ensuring that any updates to the data are correctly linked and reflected where needed.

Observer Pattern (Concept)
The Observer Pattern is a design pattern where an object (called the subject) maintains a list of dependents (called observers) and notifies them automatically of any state changes.

Analogy: Think of subscribing to a newsletter — when the publisher (subject) releases new content, all subscribers (observers) get notified.

When using a freeschema query you probably use .subscribe() which returns two parameters first one is output and the second one is the query itself. Since this uses a subscriber model then you can update the second parameter to get the data change as you need.



```

// in the listing widget
SchemaQueryListener(this.selectedQuery)
      .subscribe((output, details) => {
        this.dataHolder = details;

        // since our observer has the property of totalCount which tracks the total number of objects in output this 
        // will help us change the pagination based on the total number of count.
        this.paginationWidget.setStateProperty({
          totalCount: details.totalCount,
        });


        let mypaginator = this.paginationWidget;

        // this is the function to update the page based on the data returned.
        that.renderTable(that.dataType, output);
    
        // since we are using the subscribers we do not want the subscribers to be added each time so we clear it cause we donot want old subscibers and only want a new one.
        this.paginationWidget.subscribers = [];

        // now in the condition that the pagination widget has some sort of data change i.e. somebody clicks on the 3rd page button of the widget then this updatePage function will be called inside of the paginatior which will then tell the observer to update();
        this.paginationWidget.dataChange(() => {
          mypaginator.updatePage(details);
        });
      });



      // in the pagination widget

      this.updatePage = (toUpdate) => {
        this.subscribers = [];
        toUpdate.query.page = this.page;

        // here toUpdate is the observer that is passed to the updatePage, so we call it's update() which will update it's data and fetch a totally new api.
        toUpdate.update();
      };


```

In the above example SchemaQueryListener takes in a query which is called the selectedQuery this returns  two objects one is an object called output which has the data returned by the query and second is details which is the observer for the query.



When we get details like totalCount from the observer then we can use that data based on the observer and update other widgets and in addition 