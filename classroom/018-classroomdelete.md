## Delete Class room widget

This widget helps in delete the instance concept. 
This also takes in property injection from its parent and then uses that id to do its functionality.



```
import { DeleteConceptById, FreeschemaQuery, JUSTDATA, SchemaQueryListener, StatefulWidget } from "mftsccs-browser"
import { getLocalUserId } from "../user/login.service";

export class classroomDelete extends StatefulWidget{
    data:number = 0;
    maindata:any;

    after_render(): void {
        let view:HTMLElement = this.getElementById("delete-button") as HTMLElement;
        let that = this;
        if(view){
            view.onclick = function(){
                if (confirm("Press a button!") == true) {
                    DeleteConceptById(that.data);
                } 
            }
        }

    }



     getHtml(): string {
        let html = "";

        html = `<button class="btn-primary" id="delete-button">Delete</button>`
        return html;
    }
}

```