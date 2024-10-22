## List



Now after you have created the data. You probably want to also list that data. So you might need some sort of component that will help you list the data.

To look at the specific example for the listing we are going to choose the_phonebook example. In this example the_phonebook  needs to be listed.

We are going to go through the same route of listing.

```
import {  DeleteConceptById, GetCompositionListListener,  NORMAL } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";
import { getLocalUserId } from "../user/login.service";
import './phonebook.style.css';
export class list extends StatefulWidget{
    phonebooks: any = [];
    inpage: number= 10;
    page: number = 1;


    widgetDidMount(): void {
        let userId: number = getLocalUserId();
        GetCompositionListListener("the_phonebook", userId, this.inpage, this.page, NORMAL).subscribe((output: any)=>{
            this.phonebooks = output;
            this.render();
        })
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
          </tr>
        </thead>
        <tbody id= mainbody>

        </tbody>
        </table>
        
        </div>`
        return html;
    }
}
```

Now here we are going to list all of the phonebooks that we created in the previous example. 

In the HTML section we just create a body that is a wrapper for the table. We will now need to insert the data into the table as it is loaded.

Once the data is loaded from the GetCompositionListListener function it is populated into the variable (array) phonebooks.

after this data has been loaded we again render the component but now since the data has been loaded we will populate our html with the new data.

```
    addEvents() {
      let tableElement = this.getElementById("mainbody");
      if(tableElement){
        console.log("this is the element", tableElement);
        if(this.phonebooks.length > 0){
          for(let i= 0; i< this.phonebooks.length; i++){
            let id = this.phonebooks[i].the_phonebook.id;


            // if the id is present and valid
            if(id){
                let row = document.createElement("tr");
                let col1 = document.createElement("td");
                let col2 = document.createElement("td");
                let col3 = document.createElement("td");
                let name = document.createElement("span");
                let nameValue = this.phonebooks[i].the_phonebook.name
                let phoneValue = this.phonebooks[i].the_phonebook.phone
                name.innerHTML = nameValue;
                let phone = document.createElement("span");
                phone.innerHTML = phoneValue;
                let edit = document.createElement("button");
      
                edit.setAttribute('class', 'btn btn-primary');
                edit.setAttribute('padding', "10px");
                edit.id = this.phonebooks[i].the_phonebook.id;
                edit.innerHTML = "edit";
      
                let del = document.createElement("button");
                del.setAttribute('class', 'btn btn-primary');
                del.setAttribute('padding', "10px");
                del.id = this.phonebooks[i].the_phonebook.id;
                del.innerHTML = "Delete";
                del.onclick = () =>{
                    if(id){
                        DeleteConceptById(id).then(()=>{
                            console.log("this is the delete notify");
                          });
                    }
    
      
                }

                col1.append(name);
                col2.append(phone);
                col3.append(del);
      
                row.appendChild(col1);
                row.appendChild(col2);
                row.appendChild(col3);
                tableElement.append(row);
            }
            
          }
      }



      }

      }
```



This function might look large but it does nothing more than looping over the data and populating it so that it will append the data to the table that we created in the HTML section.



Now the style does not look preety but if you want to add some styles to your html then you must create a file for example here phonebook.styles.css and import it in this file.

Here you had the option to delete the record also. If the delete button is clicked then the memory tree will be updated. This will update other listening widgets.