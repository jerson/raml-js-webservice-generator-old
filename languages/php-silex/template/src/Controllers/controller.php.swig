<?php

namespace App\Controllers;

use Symfony\Component\HttpFoundation\JsonResponse;

class {{ group.name }}Controller
{

    public function __construct()
    {

    }
    {% for resource in group.resources %}{% for methodObject in resource.methods %}
    public function {{ methodObject.action }}{{ resource.suffix }}()
    {
    	return new JsonResponse(['name'=>'{{ methodObject.action }} {{ resource.suffix }}']);
    }{% endfor %}
{% endfor %}

}
