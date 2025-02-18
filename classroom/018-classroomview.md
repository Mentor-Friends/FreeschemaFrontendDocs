## View Class room widget

This is the widget to view the data . This widget needs another parent widget to pass a property to it for its functionality to work. Here the property is the classroom's instance id.


```
import { FreeschemaQuery, JUSTDATA, SchemaQueryListener, StatefulWidget } from "mftsccs-browser"
import { classlist } from "./classroom.index";
import { classlistCreate } from "./classroomcreate.index";
import { getLocalUserId } from "../user/login.service";

export class classroomView extends StatefulWidget{
    data:number = 0;
    maindata:any;

    after_render(): void {
        let view:HTMLElement = this.getElementById("edit-button") as HTMLElement;
        let that = this;
        if(view){
            view.onclick = function(){
                let viewShow = document.getElementById("view-show");
                if(viewShow){

                    viewShow.setAttribute("display", "block");
                                let userId: number = getLocalUserId();
                                let classroomdata:FreeschemaQuery = new FreeschemaQuery();
                                classroomdata.typeConnection = "the_classroom_name";
                                classroomdata.name = "classroomdata";
                    
                                let freeschemaQuery:FreeschemaQuery = new FreeschemaQuery();

                                // that.data  is passed by the parent widget( this is a type of property injection)
                                freeschemaQuery.conceptIds = [that.data];
                                freeschemaQuery.name = "top";
                                freeschemaQuery.freeschemaQueries = [classroomdata];
                                freeschemaQuery.outputFormat = JUSTDATA;
                                freeschemaQuery.selectors = ["the_classroom_location"];
                    
                    
                    
                                SchemaQueryListener(freeschemaQuery, "").subscribe((data:any)=>{
                                    that.maindata = data;
                                    console.log("this is the main data in view", data);
                                    viewShow.innerHTML = that.maindata;
                                })
                }
            }
        }

    }



     getHtml(): string {
        let html = "";

        html = `<button class="btn-primary" id="edit-button">View</button>`
        return html;
    }
}

```

This widget only contains a button in the name of html and all the functionality is added to the after_render because the data only needs to load when the button is clicked.
