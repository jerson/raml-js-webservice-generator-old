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
    public function {{ methodObject.action }}{{ resource.suffix }}(Application $app, Request $request)
    {
        {%  if methodObject.action == 'get' %}
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\{{ group.name }}')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            return json_encode($entity);
        {%  elseif methodObject.action == 'create' %}
            $em = $app['db.orm.em'];
            $entity = new Entity\{{ group.name }}();

            $form = $app['form.factory']->create(new Form\{{ group.name }}Type(), $entity);
            $form->handleRequest($request);

            if ($form->isValid()) {

                $em->persist($entity);
                $em->flush();

                return $app->redirect($app['url_generator']->generate('acme_show', array('id' => $entity->getId())));
            }

            return json_encode(['error'=>true]);
        {%  elseif methodObject.action == 'update' %}
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\{{ group.name }}')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            $form = $app['form.factory']->create(new Form\{{ group.name }}Type(), $entity);
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em->flush();
                $app['session']->getFlashBag()->add('success', 'Entity update successfull!');

                return $app->redirect($app['url_generator']->generate('acme_show', array('id' => $entity->getId())));
            }

            return json_encode(['error'=>true]);
        {%  elseif methodObject.action == 'delete' %}
            $em = $app['db.orm.em'];
            $entity = $em->getRepository('Entity\{{ group.name }}')->find($id);

            if (!$entity) {
                $app->abort(404, 'No entity found for id '.$id);
            }

            $em->remove($entity);
            $em->flush();

            return json_encode(['success'=>true]);
        {%  elseif methodObject.action == 'index' %}
            $em = $app['db.orm.em'];
            $entities = $em->getRepository('Entity\{{ group.name }}')->findAll();

            return json_encode($entities);
        {%  else %}
            //TODO You need to implement this!!!
            return json_encode(['error'=>'You need to implement this!!!']);
        {% endif %}
    }{% endfor %}
    {% endfor %}

}
