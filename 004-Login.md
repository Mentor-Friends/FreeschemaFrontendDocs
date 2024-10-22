## Login



Before starting anything we must be able to authenticate into the system. Freeschema is a user specefic system. Here each user has different data and access levels. This helps us scale up without adding any big logic for discerning user access. It is very important because this gives us individual connection/ concept level access for each user.



Now let us create a widget for login that we can use for authentication.



```
import { LoginToBackend } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";
import { saveTolocalStorage } from "./login.service";

export class login extends StatefulWidget{
//// you logic will go here.
}
```

Here we created a widget using the StatefulWidget which you will get to learn very soon.



In this class we need to define three functions.

getHtml() : This function will give us the html for the widget.

```
    /**
     * This is the main html component of our creating widget.
     * @returns returns a form that takes in name and number for the phone book.
     */
         getHtml(): string {
            let html = "";
            html = `<div>
            <form>
                <div>
                    <input type = text id="email" placeholder="email">
                    <input type = password id="password" placeholder="password">
                    <button id="submit">Submit</button>
                </div>
            </form>
    
            </div>`
            return html;
        }
```



addEvents() : This is a StatefulWidget specefic function that can be used to add the logic after the html has been rendered.

Here you can use LoginToBackend(email, password) function to get the output response and save them to local storage.

In the saveToLocalStorage() function there is another function inside of it that stores the authentication information to freeschema.

```
    /**
     * These are the events that user adds. These could be any thing like populating the data to creating the data
     * 
     */
        addEvents(): void {
            let email = this.getElementById("email") as HTMLInputElement;
            let password = this.getElementById("password") as HTMLInputElement;
            let submitButton = this.getElementById("submit");
            console.log("this is the submit button eventeer", submitButton);
            if(submitButton){
                submitButton.onclick = (ev: Event) => {
                    ev.preventDefault();
        
                    console.log("this is the login clicked");
                    LoginToBackend(email.value, password.value).then((output: any)=>{
                        console.log("This is the value", output);
                        saveTolocalStorage(output);
                    })
                    
                }
            }

        }

```

