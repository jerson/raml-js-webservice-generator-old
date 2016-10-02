# RAML JS WebService Generator

RAML webservice generator .. is still in development!!

See [Sample Project generated](https://github.com/jerson/raml-js-webservice-generator-example) 

Or see [Video DEMO](https://www.youtube.com/watch?v=AufIRxuaS9w)



##RAML Example

```YAML

   #see test/fixtures/movies/api.raml

   #%RAML 0.8
    
   title: World Movie API
   baseUri: http://example.api.com/{version}
   version: v1
   traits:
     - paged:
         queryParameters:
           pages:
             description: The number of pages to return
             type: number
   schemas:
    - actor: !include ../../../test/fixtures/movies/actor.schema
    - genre: !include ../../../test/fixtures/movies/genre.schema
    - movie: !include ../../../test/fixtures/movies/movie.schema
    - news: !include ../../../test/fixtures/movies/news.schema
    - autor: !include ../../../test/fixtures/movies/autor.schema
   /movie:
     get:
       responses:
         200:
           body:
             application/json:
               schema: "Movie[]"
```
##Output Schema
![schema](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/schema.png "Schema Generado")



##Example Output Project

![project](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/directory.png "Directories")


##UI Screenshots

![step1](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/app/step1.png "Step1")
![step2](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/app/step2.png "Step2")
![step3](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/app/step3.png "Step3")
![step4](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/app/step4.png "Step4")
