<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

{% for resource in resources %}

    {% for methodObject in resource.methods %}
    Route::{{ methodObject.method }}('{{ resource.parentRelativeUri }}{{ resource.relativeUri }}', '{{ resource.name }}Controller@{{ methodObject.action }}');
    {% endfor %}

{% endfor %}

//Route::controllers([
//	'auth' => 'Auth\AuthController',
//	'password' => 'Auth\PasswordController',
//]);
