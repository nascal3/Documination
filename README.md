## Documination: An API documentation Illumination💡
This project generates documentation for APIs done **OpenAPI** standards and creates a _Redoc_ HTML file
with a corresponding JSON representation of the same documentation.
### Set-up
Once you have cloned the project file on your preferred location. Navigate to the root folder and on 
CLI run `npm install`. That's all!😊

### Generate documentation
Now on to the fun part, generate your documentation. Navigate to the `docs` folder that 
is in the root folder. Create a new folder where your documentation files will live.

#### Documentation file structure:
The naming convention of your documentation file <span style="color:red">**MUST NOT**</span> contain any spaces or special characters for a better experience.
Create a `tags` folder under your main documentation folder. This file will contain the JSON files that will be used to create tags used to help group/arrange 
your documentation. Below is an image with an example of the structure:

![file-structure.png](assets%2Ffile-structure.png)

This example above takes to account the main documentation folder is named `example_services`. In the `tags` folder create the
`tagGroups.json` file to be used to group your tags. If you choose to exempt grouping your tags
this file can be left with an empty array. If not, here is an example of how to format of its contents based on
this example.\
**NB:** _The `tagGroups.json` is required file. It can however have an empty array if you wish to not use the feature it 
provides._

**_example_services/tags/tagGroups.json_**
```json
[
  {
    "name": "User Management",
    "tags": ["user"]
  },
  {
    "name": "Statistics",
    "tags": ["store", "pet"]
  }
]
```
As for the other _JSON_ folders holding information about the endpoints documentation tag content. Their contents must
be in the following format e.g. for the `pet.json` file (which represents a tag).

_**example_services/pet.json**_
```json
{
  "name": "pet",
  "description": "Everything about your Pets",
  "externalDocs": {
    "description": "Find out more",
    "url": "http://swagger.io"
  }
}
```
It is also **MANDATORY** to have a description about the project you are documenting this details can be set in
the `info.json` file under the project directory. Here is an example of how the format is set:\
**NB:** _The `info.json` file and its contents are required. The build will fail if left out._

**_example_services/info.json_**
```json
{
  "description": "This is an example of how & where the description of your application should be put. Use `markdown` format if you want to.",
  "version": "1.0.3",
  "title": "Example Services"
}
```

To set up the documentation for the default base URLs of your application endpoints, this can be done in the `servers.json` file
this file if under the `servers` directory. This file is also **MANDATORY** for the documentation to generate successfully.
Here is an example of the structure of the contents in this file:

#### _**example_services/servers/servers.json**_
```json
[
  {
    "url": "https://develoment-server/api/v1.com",
    "description": "Development server"
  },
  {
    "url": "https://production-server/api/v1.com",
    "description": "Production server"
  }
]
```

**NB:** _The `servers.json` file and its contents are required. The build will fail if left out._
#### Endpoints documentation:
The _JSON_ files to document endpoints will be under your documentation directory.
Here's an example of how the *JSON* structure would look like in the `user.json` file to document 
the `user` related endpoints:

**_example_services/user.json_**
```json
{
  "/user/createWithArray": {...},
  "/user/createWithList": {...},
  "/user/{username}": {...},
  "/user/login": {...},
  "/user": {...}
}
```

You also have the option to specify/override the default base URL configuration for your endpoints here.
To override this default base URL configuration for a specific endpoint, place the [server configuration block](#example_servicesserversserversjson)
as the first argument in the endpoint configuration object, as shown below.

**_example_services/user.json_**
```json
  "/user/createWithArray": {...},
  "/user/createWithList": {...},
  "/user/{username}": {...},
  "/user/login": {
    "servers": [
        {
        "url": "https://auth-dev-server.com",
        "description": "Development server"
        },
        {
        "url": "https://auth-production-server.com",
        "description": "Production server"
        }
    ],
    "get": {...}
  },
  "/user": {...}
```

To explore further information on the JSON endpoint representation structure, look at the 
file `user.json` under the `example_services` directory.

**NB:** _The JSON structure follows `openAPI 2.0`, but will also work with `openAPI 3.0`
JSON format._

### Finally generate 🚀
Once all your documentation JSON files are in place run `npm run generate` or `node index.js` and get your docs 
generated. Once successfully generated this is what you will see on the CLI:

![generated.png](assets%2Fgenerated.png)

You will then find the documentation generated in **_JSON_** and _**HTML**_ in the `dist` directory. As shown in the 
below example.

![generated_result.png](assets%2Fgenerated_result.png)

Done... go make awesome docs🔥

