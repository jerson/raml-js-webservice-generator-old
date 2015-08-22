# raml-js-webservice-generator
RAML webservice generator

[![Flattr this](http://button.flattr.com/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=JairoHonorio&url=https%3A%2F%2Fgithub.com%2Fjahd2602%2Framl-js-webservice-generator)

##RAML Example

```YAML

#%RAML 0.8

title: World Video API
baseUri: http://example.api.com/{version}
version: v1
schemas:
 - actor: !include actor.schema
 - genre: !include genre.schema
 - movie: !include movie.schema
 - news: !include news.schema
 - autor: !include autor.schema

```
