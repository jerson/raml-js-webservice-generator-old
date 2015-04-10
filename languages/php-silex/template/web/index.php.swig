<?php

require_once __DIR__.'/../vendor/autoload.php';


{% for group in resourceGroups %}
use App\Controllers\{{ group.name }}Controller;
{% endfor %}

$app = new Silex\Application();

$app->get('/', function() {
    return 'Home';
});

{% for group in resourceGroups %}
    $app['{{ group.name }}.controller'] = $app->share(function() use ($app) {
    return new {{ group.name }}Controller();
    });
{% endfor %}


{% for group in resourceGroups %}
    {% for resource in group.resources %}
        {% for methodObject in resource.methods %}
            $app->{{ methodObject.method }}('{{ resource.parentRelativeUri }}{{ resource.relativeUri }}', '{{ resource.name }}.controller:{{ methodObject.action }}{{ resource.suffix }}Action');
        {% endfor %}
    {% endfor %}
{% endfor %}

{#{% for resource in resources %}#}
        {#{% for methodObject in resource.methods %}#}
{#$app->{{ methodObject.method }}('{{ resource.parentRelativeUri }}{{ resource.relativeUri }}', function() {#}
   {#return '{{ resource.name }}Controller@{{ methodObject.action }}{{ resource.suffix }}';#}
{#});#}
        {#{% endfor %}#}
{#{% endfor %}#}


$app->run();
