# raml-js-webservice-generator

RAML webservice generator .. is still in development!!

##RAML Example

```YAML

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
     post:
       responses:
         200:
           body:
             application/json:
               schema: "Movie"
     /top:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Movie[]"
     /{id}:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Movie"
       put:
         responses:
           200:
             body:
               application/json:
                 schema: "Movie"
       delete:
         responses:
           200:
             body:
               application/json:
                 schema: "Movie"
       /genres:
         get:
           responses:
             200:
               body:
                 application/json:
                   schema: "Genre[]"
   /news:
     get:
       responses:
         200:
           body:
             application/json:
               schema: "News[]"
     post:
       responses:
         200:
           body:
             application/json:
               schema: "News"
     /latest:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "News[]"
     /{id}:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "News"
       put:
         responses:
           200:
             body:
               application/json:
                 schema: "News"
       delete:
         responses:
           200:
             body:
               application/json:
                 schema: "News"
   /autor:
     get:
       responses:
         200:
           body:
             application/json:
               schema: "Autor[]"
     post:
       responses:
         200:
           body:
             application/json:
               schema: "Autor"
     /featured:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Autor[]"
     /{id}:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Autor"
       put:
         responses:
           200:
             body:
               application/json:
                 schema: "Autor"
       delete:
         responses:
           200:
             body:
               application/json:
                 schema: "Autor"
   /actor:
     get:
       responses:
         200:
           body:
             application/json:
               schema: "Actor[]"
     post:
       responses:
         200:
           body:
             application/json:
               schema: "Actor"
     /featured:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Actor[]"
     /{id}:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Actor"
       put:
         responses:
           200:
             body:
               application/json:
                 schema: "Actor"
       delete:
         responses:
           200:
             body:
               application/json:
                 schema: "Actor"
   /genre:
     get:
       responses:
         200:
           body:
             application/json:
               schema: "Genre[]"
     post:
       responses:
         200:
           body:
             application/json:
               schema: "Genre"
     /featured:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Genre[]"
     /{id}:
       get:
         responses:
           200:
             body:
               application/json:
                 schema: "Genre"
       put:
         responses:
           200:
             body:
               application/json:
                 schema: "Genre"
       delete:
         responses:
           200:
             body:
               application/json:
                 schema: "Genre"
```
##Output Schema
![consola](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/schema.png "Schema Generado")



##Example Output Project

![proyecto](https://github.com/jahd2602/raml-js-webservice-generator/raw/master/doc/images/directory.png "Directories")


##Example PHP Controller


```php
<?php

namespace Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Entity;
use Form;

/**
 * Movie controller
 *
 */
class MovieController implements ControllerProviderInterface {

    /**
     * Route settings
     *
     */
    public function connect(Application $app) {
        $indexController = $app['controllers_factory'];

        $indexController->get("/movie", array($this, 'showMovie'))->bind('Movie_showMovie');
        $indexController->post("/movie", array($this, 'createMovie'))->bind('Movie_createMovie');
        
        $indexController->get("/movie/top", array($this, 'showTop'))->bind('Movie_showTop');
        
        $indexController->get("/movie/{id}", array($this, 'showId'))->bind('Movie_showId');
        $indexController->put("/movie/{id}", array($this, 'updateId'))->bind('Movie_updateId');
        $indexController->delete("/movie/{id}", array($this, 'deleteId'))->bind('Movie_deleteId');
        
        $indexController->get("/movie/{id}/genres", array($this, 'showIdGenres'))->bind('Movie_showIdGenres');
        
        
        return $indexController;
    }

    
    /**
    * showMovie Movie
    *
    */
    public function showMovie(Application $app, Request $request)
    {
        
            $em = $app['db.orm.em'];
            $entities = $em->getRepository('Entity\Movie')->findAll();

            return new Response($app['serializer']->serialize($entities, 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        
    }
    /**
    * createMovie Movie
    *
    */
    public function createMovie(Application $app, Request $request)
    {
        
            $em = $app['db.orm.em'];
            $entity = new Entity\Movie();

            $form = $app['form.factory']->create(new Form\MovieType(), $entity);
            $form->handleRequest($request);

            if ($form->isValid()) {

                $em->persist($entity);
                $em->flush();

                return $app->redirect($app['url_generator']->generate('Movie_showId', array('id' => $entity->getId())));
            }

            return new Response($app['serializer']->serialize(['error'=>$form->getErrorsAsString(),'data'=>$form->getViewData()], 'json'), 200, array(
                'Content-Type' => $request->getMimeType('json')
            ));
        
    }
    
    /**
    * showTop Movie
    *
    */
    public function showTop(Application $app, Request $request)
    {
        
            $em = $app['db.orm.em'];
            $entities = $em->getRepository('Entity\Movie')->findAll();

            return new Response($app['serializer']->serialize($entities, 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        
    }
    
    /**
    * showId Movie
    *
    */
    public function showId(Application $app, Request $request, $id)
    {
        
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\Movie')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            return new Response($app['serializer']->serialize($entity, 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        
    }
    /**
    * updateId Movie
    *
    */
    public function updateId(Application $app, Request $request, $id)
    {
        
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\Movie')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            $form = $app['form.factory']->create(new Form\MovieType(), $entity);
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em->flush();

                return $app->redirect($app['url_generator']->generate('Movie_showId', array('id' => $entity->getId())));
            }

            return new Response($app['serializer']->serialize(['error'=>$form->getErrorsAsString(),'data'=>$form->getViewData()], 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        
    }
    /**
    * deleteId Movie
    *
    */
    public function deleteId(Application $app, Request $request, $id)
    {
        
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\Movie')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            $em->remove($entity);
            $em->flush();

            return new Response($app['serializer']->serialize(['success'=>true], 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        
    }
    
    /**
    * showIdGenres Movie
    *
    */
    public function showIdGenres(Application $app, Request $request)
    {
        
            $em = $app['db.orm.em'];
            $entities = $em->getRepository('Entity\Genre')->findAll();

            return new Response($app['serializer']->serialize($entities, 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        
    }
    

}


```



##Example JSON output


```json
      {
          "id": 13,
          "name": "lalala",
          "slug": "ssfgssdfsdf",
          "autor": {
            "id": 4,
            "name": "fsdfdsdsdfsdsgdfgfsdf"
          },
          "dateReleased": {
            "lastErrors": {
              "warning_count": 0,
              "warnings": [],
              "error_count": 0,
              "errors": []
            },
            "timezone": {
              "name": "America/Lima",
              "location": {
                "country_code": "PE",
                "latitude": -12.05,
                "longitude": -77.05,
                "comments": ""
              }
            },
            "offset": -18000,
            "timestamp": 1444453200
          },
          "year": 2015,
          "trailer": "gdfgdfg",
          "sinopsis": "gdfgd",
          "musicians": [
            "ccccc"
          ],
          "screenwriters": [
            "sdfsdfs"
          ],
          "directors": [
            "cvxcvxv"
          ],
          "producers": [
            "sdfsdf",
            "sdfsdfsdf"
          ],
          "actors": [
            {
              "id": 1,
              "name": "fsdfdsdsdfsdsfsdf",
              "slug": "gdfgdfgdfg",
              "country": "1",
              "birthday": null,
              "biography": "dfgdfgdfg",
              "image": "sdfsdfsdf"
            },
            {
              "id": 3,
              "name": "fsdfdsdsdfsdsfsdf",
              "slug": "gdfgdfgsfdfgdfdfg",
              "country": "1",
              "birthday": null,
              "biography": "dfgdfgdfg",
              "image": "sdfsdfsdf"
            }
          ],
          "genres": [],
          "linksWatch": [],
          "linksDownload": [
            {
              "id": 1,
              "link": "dfgdfd",
              "provider": "fdgdfg",
              "language": "es",
              "format": "dfgdfg"
            },
            {
              "id": 9,
              "link": "dfsdfsdfsdsfdsf",
              "provider": "fdgddfgfg",
              "language": "esdfg",
              "format": "dfgdfgdfg"
            }
          ],
          "views": 4545,
          "rating": 13,
          "nextRelease": false,
          "image": "gdfgdfg"
      }

```