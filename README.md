
<b> Projet nodeJs :</b>  App_Location_voiture_back <br>  
<b> Groupe de travail : </b> 
- Ducros Romain 
- Maria Gregoire 

<b>Install :</b>
 
 setup :  
 
 Install node.js 
 https://nodejs.org/en/download/

create folder where you want install greenplace
open cmd 
git clone greenplace repositories
> git clone https://github.com/ProDiG31/AppLocationVoiture_Back.git

install dependencies via npm (npm is installed with node.js)
> npm install

<b>Path :</b>

``` [POST] /newUser ```
<br> => Request for creating new user as format : <br>
> {
> "name":"XXX",
> "firstname":"XXX",
> "username":"XXX",
> "mail":"XXX@google.com",
> "location": "XXX",
>	"password":"XXX",
> }


``` [POST] /login ``` 
<br> => Request for login as format : <br>
> {
>   "username":"XXX",
> 	"password":"XXX",
> }


<b>Idea :</b>
 
 - [ ] Gestion de compte / session 
 - [ ] Ajout d'arbre 
 - [ ] filtre de recherche sur la carte 
 - [ ] formulaire d'édition des arbres / comptes 
 - [ ] formulaire de login 

