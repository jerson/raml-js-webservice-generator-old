<?php

{% for group in resourceGroups %}{% spaceless %}
    $app->mount('/', new Controller\{{ group.name }}Controller());
{% endspaceless %}
{% endfor %}

