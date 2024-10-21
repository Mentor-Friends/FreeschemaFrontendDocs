## Introduction



LifeCycle of Stateful Widget

This is the lifecycle of a stateful widget.

Each widget has a lifecycle. Currently we have Mounting and Updating.



Mounting is Putting the widget in the DOM.

In Stateful widget you need to define a function called getHtml() which will return a Promise<string>. The html that is defined in this getHtml() section is rendered.

If there is any data that needs to be added to this widget the best place to call it is in componentDidMount(). Currently we need to add this.render() inside of the beforeMount() once the data has been loaded.



addEvents() is called when the widget has been added to DOM.