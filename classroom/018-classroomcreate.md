## Create Class room widget

Suppose you want to create  a data with type connections then this example will help you create those.
Let's take a simple thing called a classroom and we need to create this with our knowledge of freeschema.

Then a way to create a widget for creating classroom is


```

import { CreateTheConnectionLocal, DeleteConnectionByType, FreeschemaQuery, GetTheConcept, LocalSyncData, MakeTheInstanceConceptLocal, MakeTheTypeConceptLocal, PRIVATE, SchemaQueryListener, StatefulWidget } from "mftsccs-browser"
import { getLocalUserId } from "../user/login.service";

export class classlistCreate extends StatefulWidget{
    myphonebooks: any;
        before_render(): void {
            this.render();
        }

        // we get the elements from the form and get their values to save.
        after_render(){
             let userId:number = getLocalUserId();
                    let name = this.getElementById("name") as HTMLInputElement;
                    let location = this.getElementById("location") as HTMLInputElement;
                    let id = this.getElementById("id") as HTMLInputElement;
                    if(this.data){
                        name.value = this.data.name;
                        location.value = this.data.location;
                        id.value = this.data.id;
                    }
                    let submitButton = this.getElementById("submit");
                    if(submitButton){
                        submitButton.onclick = (ev: Event) => {
                            ev.preventDefault();
                                if(id.value){
                                    let updateId = Number(id.value);
                                    DeleteConnectionByType(updateId, "the_classroom_name").then(()=>{
                                        DeleteConnectionByType(updateId, "the_classroom_location").then(()=>{
                                            this.createClassRoom(updateId, name.value, location.value );

                                        })

                                    })
                
                                }
                                else{
                                    MakeTheInstanceConceptLocal("the_classroom", "", true,userId,PRIVATE).then((mainconcept)=> {
                                        this.createClassRoom(mainconcept.id, name.value, location.value );
    
                                    });
                                }


                            
                
                
                            console.log("submit button clicked");
                        }
                    }
        }

        // this function is used to create a class room given the top id of the composition.
        createClassRoom(mainConceptId:number, name:string, location:string ){
            let userId:number = getLocalUserId();
            let order:number = 1000;
            MakeTheTypeConceptLocal("the_classroom_name", 999,999,userId).then((classroom)=>{
                MakeTheTypeConceptLocal("the_classroom_location", 999,999,userId).then((locationType)=>{
                MakeTheInstanceConceptLocal("name", name,false, userId, PRIVATE).then((concept)=>{
                    MakeTheInstanceConceptLocal("location", location, false, userId,PRIVATE).then((concept2) => {
                        CreateTheConnectionLocal(mainConceptId, concept.id, classroom.id, order, "", userId).then(()=>{
                            CreateTheConnectionLocal(mainConceptId, concept2.id, locationType.id, order, "", userId).then(()=>{
                                LocalSyncData.SyncDataOnline();
                            })
                        })
                    });
                });
                });

            });
        }


            /**
     * This is the main html component of our creating widget.
     * @returns returns a form that takes in name and number for the phone book.
     */
     getHtml(): string {
        let html = "";
        html = `<div class="container">
        <form>
            <div>
                <input type= number id=id hidden>
                <div class="formbody">
                    <label> name </label>
                    <input  type = text id="name" placeholder="name">
                </div>
                <div class="formbody">
                    <label> Location </label>
                    <input   type = text id="location" placeholder="location">
                </div>
                <button class=" btn btn-primary" id="submit" type=submit>Submit</button>
            </div>
        </form>

        </div>`
        return html;
    }
}
```

Here we have added a new form to create a data namely data related to the classroom, we have assigned two variables name and location that describe the classroom and created a connection of type the_classroom_name and the_classroom_location

There is also logic to update the classroom added to this widget in case that we have to edit data.


