## List



Now after you have created the data. You probably want to also list that data. So you might need some sort of component that will help you list the data.

To look at the specific example for the listing we are going to choose the_phonebook example. In this example the_phonebook  needs to be listed.

We are going to go through the same route of listing.

```
import {  DeleteConceptById, GetCompositionListListener,  NORMAL } from "mftsccs-browser";
import { StatefulWidget } from "../../default/StatefulWidget";
import { getLocalUserId } from "../user/login.service";
import  './list.style.css';
export class list extends StatefulWidget{
    phonebooks: any = [];
    inpage: number= 10;
    page: number = 1;
    linker: string = "console_folder_s";


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
              <th>Edit</th>
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

Now here we are going to list all of the phonebooks that we created in the previous example. For this we create a widget that has html table body inserted inside of it. 