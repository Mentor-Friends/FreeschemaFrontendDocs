## Routing

Routing is a very important part of any application. We are implementing routing here via javascript because we are an frontend framework. 

For adding routes to your application you can go to routes.ts page and add it there in the RouteParam array.

The routes must have the following property.

```
type RouteParams = {
  /**
   * This is a path for route url
   */
  path: any;
  /**
   * This is a label for the route as a name
   */
  linkLabel?: string;
  /**
   * This is the content that route renders
   */
  content: any;
  /**
   * If path needs to be authenticated. ie. true, false
   */
  isAuthenticated?: boolean;
};
```

Here isAuthenticated flag is the auth guard for our system. You should not be allowed to go to routes where this flag is enabled without logging into the system.

Our routing is totally based on our widget system so anything you do on the system must be a widget.