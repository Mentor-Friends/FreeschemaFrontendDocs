## List classrooms 



Now we list the classroom that we just created. This widget combines view widget, delete widget inside one so that we can then combine multiple widgets.

```
import { FreeschemaQuery, JUSTDATA, renderWidget, SchemaQueryListener, StatefulWidget } from "mftsccs-browser"
import { getLocalUserId } from "../user/login.service";
import { classroomView } from "./classroom.view";
import { classroomDelete } from "./classroom.delete";

export class classlist extends StatefulWidget{
    myphonebooks: any;
        before_render(): void {
            let userId: number = getLocalUserId();
            let classroomdata:FreeschemaQuery = new FreeschemaQuery();
            classroomdata.typeConnection = "the_classroom_name";
            classroomdata.name = "classroomdata";

            let freeschemaQuery:FreeschemaQuery = new FreeschemaQuery();
            freeschemaQuery.type = "the_classroom";
            freeschemaQuery.name = "top";
            freeschemaQuery.freeschemaQueries = [classroomdata];
            freeschemaQuery.outputFormat = JUSTDATA;
            freeschemaQuery.selectors = ["the_classroom_location"];



            SchemaQueryListener(freeschemaQuery, "").subscribe((data:any)=>{
                this.myphonebooks = data;
                console.log("this is the data", data);
                this.render();
            })
        }

        after_render() {
              let tableElement = this.getElementById("mainbody");
              if(tableElement){
                console.log("this is the element", tableElement, this.myphonebooks?.length);
                if(this.myphonebooks.length > 0){
                  for(let i= 0; i< this.myphonebooks.length; i++){
                    let id = this.myphonebooks[i]?.id
                    let data = this.myphonebooks[i]?.the_classroom;
        
        
                    // if the id is present and valid
                    if(id){
                        let row = document.createElement("tr");
                        let col1 = document.createElement("td");
                        let col2 = document.createElement("td");
                        let col3 = document.createElement("td");
                        let col4 = document.createElement("td");
                        let col5 = document.createElement("td");
                        let name = document.createElement("span");
                        let nameValue = data.the_classroom_name?.the_name.data;
                        let locationValue = data.the_classroom_location?.the_location.data;
                        name.innerHTML = nameValue;
                        let phone = document.createElement("span");
                        phone.innerHTML = locationValue;
                        let edit = document.createElement("button");
              
                        edit.setAttribute('class', 'btn btn-primary');
                        edit.setAttribute('padding', "10px");
                        edit.id = this.myphonebooks[i].id;
                        edit.innerHTML = "edit";
              
                        let del = document.createElement("button");
                        del.setAttribute('class', 'btn btn-primary');
                        del.setAttribute('padding', "10px");
                        del.id = this.myphonebooks[i].id;
                        del.innerHTML = "Delete";

                        // this is where we programatically inject view widget inside of the list widget.
                        let viewWidget = new classroomView();
                        viewWidget.data = Number(del.id);
                      
                      // this is where we programatically inject delete widget inside of the list widget.
                        let deleteWidget = new classroomDelete();
                        deleteWidget.data = Number(del.id);

                        let that = this;
                        edit.onclick = () =>{
                          that.data = {
                            "id": edit.id,
                            "name": nameValue,
                            "location": locationValue
                          }
                          console.log("this is the update click", that.data, that.subscribers);
                          
                          that.notify();
                        }
        
                        col1.append(name);
                        col2.append(phone);
                        //col3.append(del);
                        deleteWidget.mount(col3);
                        col4.append(edit);
                        viewWidget.mount(col5);
              
                        row.appendChild(col1);
                        row.appendChild(col2);
                        row.appendChild(col3);
                        row.appendChild(col4);
                        row.appendChild(col5);
                        tableElement.append(row);
                    }
                    
                  }
              }
        
        
        
              }
        
              }


        getHtml(): string {

            let html = "";
    
            html = `<div>
            <table>
            <thead>
              <tr>
                  <th>name</th>
                  <th>phone</th>
                  <th>Delete</th>
                  <th>Edit</th>
                    <th>View</th>
              </tr>
            </thead>
            <tbody id= mainbody>
    
            </tbody>
            </table>
            <div id="view-show"></div>
            
            </div>`
            return html;
        }
}
```

Here we dynamically create a html table view from the data listed.

```
      // this is where we programatically create another widget inside the list.
      let viewWidget = new classroomView();
      viewWidget.data = Number(del.id);

```

This section above then allows us to use a widget inside of another widget.
Currently our framework provides this raw version of <b>widget injection</b>.

