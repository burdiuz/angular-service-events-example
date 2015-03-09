# angular-service-events-example

Angular service can notify about changes in different ways, most common are:
###### Use promises
This is best solution if you can handle notification in same place where they requested.
```javascript
$http.get('/url').then(...
```

###### Use events
Events an be used to globally notify about changes in service current state.
```javascript
$rootScope.$emit('event-name', ...
```

Using events developer usually faces some problems and decisions, like decide how
to propagate events and how to name them and keep unique. So naming conventions and
namespaces are coming along with long strings to remember and typos. The biggest
problem is silence you get if event didn't reach destination.

# Proposal
For services which should notify about state changes globally use separate, dependent
services with will provide API for listening such events.
For example, if you have customService, add two more customDispatcherService and customListenerService.
 * customService - main service that should notify about its state
 * customDispatcherService - private service that provides API for customService to fire its events.
 * customListenerService - public service that provides API for any other angular entity(controller or service) to listen for such events.

Benefits:
 * With defining such API you will have limited places where strings for event names are used.
 * With using methods instead on strings you will get errors on typos and context help from IDE.
 * With scope-per-dispatcher approach you can forget about naming conventions.
 * Having method to send and method to receive specific event connection will stronger, no need to test it every time its used.

Download this repo for an example.