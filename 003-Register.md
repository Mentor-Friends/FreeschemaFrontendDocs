## Register

You need to first register you user into the concept connection system. This can be done using our function.



```
        import { Signup, SignupModel } from "mftsccs-browser";
        
        let signupData: SignupModel = {
            email: email.value,
            password: password.value
        }
        Signup(signupData).then((output: any)=>{
            console.log("This is signup complete", output);
        })
            
```



Here the response will be where data is the userId of the regsitered user and relatedData is the userConceptId of the user. These are useful further down the line.

```
{
    "success": true,
    "message": "Created SuccessFully",
    "data": 12007,
    "relatedData": 101425418
}
```

You can also use the widget system to integrate it to our system

* UserId is the Identifier that is assigned to you. Here data is the userId.
* UserConceptId is the reference to that userId in the concept format. Here relatedData is the userConceptId.



```
// src/app/pages/user/register.example.ts

import { Signup, SignupModel } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";

export class register extends StatefulWidget{


    addEvents(): void {
        let email = this.getElementById("email") as HTMLInputElement;
        let password = this.getElementById("password") as HTMLInputElement;
        let submitButton = this.getElementById("submit");
        if(submitButton){
            submitButton.onclick = (ev: Event) => {
                ev.preventDefault();
                let signupData: SignupModel = {
                    email: email.value,
                    password: password.value
                }
                console.log("this is the login clicked");
                Signup(signupData).then((output: any)=>{
                    console.log("This is signup complete", output);
                })
                
            }
        }

    }

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
                    <input type = password id="verify-password" placeholder="password">
                    <button id="submit">Submit</button>
                </div>
            </form>
    
            </div>`
            return html;
        }
}
```

After you do this do not forget to register it in routes. In this example we have named it /register.