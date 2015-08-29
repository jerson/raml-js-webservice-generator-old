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
 * {{ group.name }} controller
 *
 */
class {{ group.name }}Controller implements ControllerProviderInterface {

    /**
     * Route settings
     *
     */
    public function connect(Application $app) {
        $indexController = $app['controllers_factory'];

        {% for resource in group.resources %}{% for methodObject in resource.methods %}{% spaceless %}
            $indexController->{{ methodObject.method }}("{{ resource.parentRelativeUri }}{{ resource.relativeUri }}", array($this, '{{ methodObject.action }}{{ resource.suffix }}'))->bind('{{ group.name }}_{{ methodObject.action }}{{ resource.suffix }}');
        {% endspaceless %}
        {% endfor %}
        {% endfor %}
        return $indexController;
    }

    {% for resource in group.resources %}{% for methodObject in resource.methods %}
    /**
    * {{ methodObject.action }}{{ resource.suffix }} {{ group.name }}
    *
    */
    public function {{ methodObject.action }}{{ resource.suffix }}(Application $app, Request $request{% if  resource.uriParameters %}, {% for uriParameter in resource.uriParameters %}${{ uriParameter.displayName }}{% endfor %}{% endif %})
    {
        {%  if methodObject.action == 'show' and resource.uriParameters %}
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\{{ methodObject | entityFromMethod }}')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            return new Response($app['serializer']->serialize($entity, 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        {%  elseif methodObject.action == 'show' and not resource.uriParameters %}
            $em = $app['db.orm.em'];
            $entities = $em->getRepository('Entity\{{ methodObject | entityFromMethod }}')->findAll();

            return new Response($app['serializer']->serialize($entities, 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        {%  elseif methodObject.action == 'index' %}
            $em = $app['db.orm.em'];
            $entities = $em->getRepository('Entity\{{ methodObject | entityFromMethod }}')->findAll();

            return new Response($app['serializer']->serialize($entities, 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        {%  elseif methodObject.action == 'create' %}
            $em = $app['db.orm.em'];
            $entity = new Entity\{{ methodObject | entityFromMethod }}();

            $form = $app['form.factory']->create(new Form\{{ methodObject | entityFromMethod }}Type(), $entity);
            $form->handleRequest($request);

            if ($form->isValid()) {

                $em->persist($entity);
                $em->flush();

                return $app->redirect($app['url_generator']->generate('{{ group.name }}_showId', array('id' => $entity->getId())));
            }

            return new Response($app['serializer']->serialize(['error'=>$form->getErrorsAsString(),'data'=>$form->getViewData()], 'json'), 200, array(
                'Content-Type' => $request->getMimeType('json')
            ));
        {%  elseif methodObject.action == 'update' %}
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\{{ methodObject | entityFromMethod }}')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            $form = $app['form.factory']->create(new Form\{{ methodObject | entityFromMethod }}Type(), $entity);
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em->flush();

                return $app->redirect($app['url_generator']->generate('{{ group.name }}_showId', array('id' => $entity->getId())));
            }

            return new Response($app['serializer']->serialize(['error'=>$form->getErrorsAsString(),'data'=>$form->getViewData()], 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        {%  elseif methodObject.action == 'delete' %}
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\{{ methodObject | entityFromMethod }}')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            $em->remove($entity);
            $em->flush();

            return new Response($app['serializer']->serialize(['success'=>true], 'json'), 200, array(
            'Content-Type' => $request->getMimeType('json')
            ));
        {%  else %}
            //TODO You need to implement this!!!
            return json_encode(['error'=>'You need to implement this!!!']);
        {% endif %}
    }{% endfor %}
    {% endfor %}

}
