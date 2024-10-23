# Authentication


To create any application in the freeschema you must be first registered in the freeschema system. You will be provided with userId, userConceptId which is helpful in creating your application.

* UserId is the Identifier that is assigned to you.
* UserConceptId is the reference to that userId in the concept format.


Now anything that you create in the system will be related to that userId and userConceptId. This is required because any data that you create need to have these property. You probably have used the registration process provided automatically in the home page in the example application. That process creates a JWT authentication profile and stores it in your localStorage which can be used further in the application.

This eliminates mostly the process of creating a user table in the normal development process, access control, role assigning etc. In the basic section access control and roles are ommitted but you will get to understand it better further in future.

But since you are creating an application you also might need to modify your user authentication process. This is permitted via the following process given in the register and login section. You can modify these as you like.

