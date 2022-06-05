
## MVC
MVC is an architectural design pattern that encourages improved application organization through a separation of concerns. 
It enforces the isolation of business data (Models) from user interfaces (Views), with a third component (Controllers) traditionally managing logic and user-input.
MVC relies on the Observer pattern for some of its core communication.

Views are a visual representation of models that present a filtered view of their current state. 
When a model changes, it will typically notify its observers that a change has occurred so that they may react accordingly.
Controllers are an intermediary between models and views which are classically responsible for updating the model when the user manipulates the view.

## MVC Vs. MVP Vs. MVVM
Both MVP and MVVM are derivatives of MVC.
The key difference between it and its derivatives is the dependency each layer has on other layers as well as how tightly bound they are to each other.

## MVP
 Model-view-presenter (MVP) is a derivative of the MVC design pattern which focuses on improving presentation logic. 
 If MVC and MVP are different it is because the C and P do different things. In MVP, the P observes models and updates views when models change. 
 The P effectively binds models to views, a responsibility which was previously held by controllers in MVC.

## MVVM
MVVM (Model View ViewModel) is an architectural pattern based on MVC and MVP, which attempts to more clearly separate the development of user-interfaces (UI) from that of the business logic and behavior in an application.
The ViewModel can be considered a specialized Controller that acts as a data converter. It changes Model information into View information, passing commands from the View to the Model.



