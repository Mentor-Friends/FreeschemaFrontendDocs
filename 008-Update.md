## Update Phonebook

Now Let's suppose we have to update the phonebook that we created. Name of the phonebook record changes or the number then we must be able to update this data.

To update this data we must be able to select the record and then update it. We might be prudent to utilize the widgets we have already build here to do that.

So let's do that . First we must add a button in the list widget to incorporate edit feature so we update the html section as below

```
	// previously written code in list widget
          <tr>
				/// previously written code in list widget
              <th>Edit</th>
          </tr>
```

Again After we have updated the html section we will need to update the addEvents() section also to add  the button.



```
          let edit = document.createElement("button");
          edit.setAttribute('class', 'btn btn-primary');
          edit.setAttribute('padding', "10px");
          edit.id = this.phonebooks[i].the_phonebook.id;
          edit.innerHTML = "edit";
          
          let that = this;
          edit.onclick = () =>{
            that.data = {
              "id": edit.id,
              "name": nameValue,
              "phone": phoneValue
            }
            console.log("this is the update click", that.data, that.subscribers);
            
            that.notify();
          }
          
          row.appendChild(edit);
          tableElement.append(row);
```





Now your phonebook widget should look like this.

![local_to_real_nodes](images/update.png)

Now after you have the Edit button and once you click it it will update the create widget.

In the create widget we need to update the addEvents section in the create widget

```
import { CreateTheConnectionLocal, LocalSyncData, MakeTheInstanceConceptLocal, PatcherStructure, UpdateComposition } from "mftsccs-browser";

....

    addEvents(): void {
        let userId:number = getLocalUserId();
        let order: 1;
        let name = this.getElementById("name") as HTMLInputElement;
        let phone = this.getElementById("phone") as HTMLInputElement;
        let id = this.getElementById("id") as HTMLInputElement;
        if(this.data){
            name.value = this.data.name;
            phone.value = this.data.phone;
            id.value = this.data.id;
        }
        let submitButton = this.getElementById("submit");
        if(submitButton){
            submitButton.onclick = (ev: Event) => {
                ev.preventDefault();
    
                if(id.value){
                    let patcherStructure: PatcherStructure = new PatcherStructure();
                    patcherStructure.compositionId = Number(id.value);
                    patcherStructure.patchObject = {
                        "name": name.value,
                        "phone": phone.value
                    }
                    UpdateComposition(patcherStructure);
                }
                else{
                    MakeTheInstanceConceptLocal("the_phonebook", "", true,userId,PRIVATE).then((mainconcept)=> {
                        MakeTheInstanceConceptLocal("name", name.value,false, userId, PRIVATE).then((concept)=>{
                            MakeTheInstanceConceptLocal("phone", phone.value, false, userId,PRIVATE).then((concept2) => {
                                CreateTheConnectionLocal(mainconcept.id, concept.id, mainconcept.id, order, "", userId).then(()=>{
                                    CreateTheConnectionLocal(mainconcept.id, concept2.id, mainconcept.id, order, "", userId).then(()=>{
                                        LocalSyncData.SyncDataOnline();
                                    })
                                })
                            });
                        });
                    });
                }
    
    
                console.log("submit button clicked");
            }
        }

    }

```



Here we have added a logic that if any id is already defined on submit then the create widget can be used as update widget.

if id is defined we create a new instance of PatcherStructure. This is used to update an composition defined in the freeschema. There are lot's of way to do this but this is the most easy way to update the composition. You could also find connections delete them and add new connections but for the scope of this example we will use this method. After this logic has been added then its just as simple as clicking the submit button. 



If you now go to the /phonebook route then click edit on any record this will populate the create widget in the phonebook (parent widget) and you will be able to edit the record once you click submit. The important part is that after you click submit the list widget automatically updates without any intervention.