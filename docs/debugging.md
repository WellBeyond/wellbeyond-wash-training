###### Testing and Debugging

The test environment (NODE_ENV !== 'production') uses the wellbeyond-development Firebase project.  

To deploy access rules or database functions to this environment, run

`firebase use wellbeyond-development`

from the root of this project.

You can run `npm start` to launch the application and then point your browser at `http://localhost:8100`.  The application should live reload as you make changes.

The easiest way to debug is to create a 'JavaScript Debug' configuration in WebStorm.  You will then be able to set breakpoints directly in the source code within the WebStorm editor. 