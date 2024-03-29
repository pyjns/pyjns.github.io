## Observer Pattern

```
One or more observers are interested in the state of a subject and register their interest with the subject by attaching themselves. 
When something changes in our subject that the observer may be interested in, a notify message is sent which calls the update method in each observer. 
When the observer is no longer interested in the subject's state, they can simply detach themselves.
```

**Subject:** maintains a list of observers, facilitates adding or removing observers
**Observer:** provides an update interface for objects that need to be notified of a Subject's changes of state
**ConcreteSubject:** broadcasts notifications to observers on changes of state, stores the state of ConcreteObservers
**ConcreteObserver:** stores a reference to the ConcreteSubject, implements an update interface for the Observer to ensure state is consistent with the Subject's

### Differences Between The Observer And Publish/Subscribe Pattern

The Observer pattern requires that the observer (or object) wishing to receive topic notifications must subscribe this interest to the object firing the event (the subject).

The Publish/Subscribe pattern however uses a topic/event channel which sits between the objects wishing to receive notifications (subscribers) and the object firing the event (the publisher). 
This event system allows code to define application specific events which can pass custom arguments containing values needed by the subscriber. 
The idea here is to avoid dependencies between the subscriber and publisher.

This differs from the Observer pattern as it allows any subscriber implementing an appropriate event handler to register for and receive topic notifications broadcast by the publisher.

