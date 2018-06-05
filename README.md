
<b> Projet nodeJs :</b>  App_Location_voiture_back <br>
  
<b> Groupe de travail : </b> 
- Ducros Romain 
- Maria Gregoire 
- Rachid Medjdoub

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

:heavy_check_mark: ``` [POST] /newUser ```
<br> => Request for creating new user as format : <br>
> {
> "name":"XXX",
> "firstname":"XXX",
> "username":"XXX",
> "mail":"XXX@google.com",
> "location": "XXX",
>	"password":"XXX"
> }


:heavy_check_mark: ``` [POST] /login ``` 
<br> => Request for login as format : <br>
> {
>   "username":"XXX",
> 	"password":"XXX"
> }


<b>Ideas :</b>
 
- [ ] Gestion de compte / session  
    - [ ] Gerer les retours la fonction /login
- [ ] Gestion d'accident / assurance   
- [ ] Liaison voiture / user  
- [ ] Location a l'heure  
- [ ] Tarification determiné par l'user 

