<?php namespace App\Http\Controllers;

class {{ group.name }}Controller extends Controller {

	/*
	|--------------------------------------------------------------------------
	| {{ group.name }} Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders the "marketing page" for the application and
	| is configured to only allow guests. Like most of the other sample
	| controllers, you are free to modify or remove it as you desire.
	|
	*/

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//$this->middleware('guest');
	}

{% for resource in group.resources %}

        {% for methodObject in resource.methods %}

            /**
            * Show the application welcome screen to the user.
            *{{ resource.suffixRelatativeUri }}
            * @return Response
            */
            public function {{ methodObject.action }}{{ resource.suffix }}()
            {
            return view('{{ methodObject.action }} {{ resource.suffix }}');
            }

        {% endfor %}

{% endfor %}

}
